'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import PartySocket from 'partysocket';
import { GameState, GameAction } from '@/types/game';

const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'localhost:1999';

interface PlayerInfo {
  id: string;
  name: string;
  connectionId: string;
  isHost: boolean;
  isReady: boolean;
}

interface RoomInfo {
  players: PlayerInfo[];
  gameStarted: boolean;
  hostId: string | null;
}

interface UseMultiplayerOptions {
  roomId: string;
  playerId: string;
  playerName: string;
  onGameStart?: (players: PlayerInfo[]) => void;
  onGameAction?: (action: GameAction, playerId: string) => void;
  onStateSync?: (state: GameState) => void;
  onError?: (message: string) => void;
  onPlayerLeft?: (playerId: string, newHostId: string | null) => void;
}

export function useMultiplayer({
  roomId,
  playerId,
  playerName,
  onGameStart,
  onGameAction,
  onStateSync,
  onError,
  onPlayerLeft,
}: UseMultiplayerOptions) {
  const [socket, setSocket] = useState<PartySocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callbacksRef = useRef({ onGameStart, onGameAction, onStateSync, onError, onPlayerLeft });
  callbacksRef.current = { onGameStart, onGameAction, onStateSync, onError, onPlayerLeft };

  useEffect(() => {
    if (!roomId || !playerId) return;

    const ws = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
      // Configure reconnection behavior
      maxRetries: 10,
      // Start with 1s delay, max 30s delay between retries
      minUptime: 1000,
    });

    // Keep-alive ping interval (every 15 seconds - more aggressive)
    let pingInterval: NodeJS.Timeout | null = null;
    let missedPongs = 0;
    const MAX_MISSED_PONGS = 3;

    ws.addEventListener('open', () => {
      setConnected(true);
      setError(null);
      missedPongs = 0;

      // Join the room
      ws.send(JSON.stringify({
        type: 'join',
        playerId,
        playerName,
      }));

      // Clear any existing ping interval
      if (pingInterval) {
        clearInterval(pingInterval);
      }

      // Start ping interval to keep connection alive (every 15 seconds)
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          missedPongs++;
          if (missedPongs > MAX_MISSED_PONGS) {
            // Connection seems dead, force reconnect
            console.warn('[useMultiplayer] Too many missed pongs, reconnecting...');
            ws.reconnect();
            missedPongs = 0;
          } else {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }
      }, 15000); // Ping every 15 seconds
    });

    ws.addEventListener('close', (event) => {
      console.log('[useMultiplayer] Connection closed, code:', event.code);
      setConnected(false);
      // Don't clear ping interval - PartySocket will auto-reconnect
    });

    ws.addEventListener('error', (event) => {
      console.error('[useMultiplayer] Connection error:', event);
      setError('Connection error - reconnecting...');
      // Don't set connected to false here - PartySocket handles reconnection
    });

    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        // Handle pong responses (keep-alive acknowledgment)
        case 'pong':
          missedPongs = 0; // Reset missed pong counter on successful response
          break;

        case 'room_state':
        case 'player_joined':
          setRoom({
            players: data.players,
            gameStarted: data.gameStarted || false,
            hostId: data.hostId,
          });
          if (data.gameState && callbacksRef.current.onStateSync) {
            callbacksRef.current.onStateSync(data.gameState);
          }
          break;

        case 'player_left':
          setRoom(prev => ({
            players: data.players,
            // Use server value if provided, otherwise preserve previous state (don't reset to false!)
            gameStarted: data.gameStarted ?? prev?.gameStarted ?? false,
            hostId: data.hostId,
          }));
          if (data.gameState && callbacksRef.current.onStateSync) {
            callbacksRef.current.onStateSync(data.gameState);
          }
          if (callbacksRef.current.onPlayerLeft && data.playerId) {
            callbacksRef.current.onPlayerLeft(data.playerId, data.hostId);
          }
          break;

        case 'rejoined':
          setRoom({
            players: data.room.players,
            gameStarted: data.room.gameStarted,
            hostId: data.room.hostId,
          });
          if (data.gameState && callbacksRef.current.onStateSync) {
            callbacksRef.current.onStateSync(data.gameState);
          }
          break;

        case 'game_started':
          setRoom(prev => prev ? { ...prev, gameStarted: true } : null);
          if (callbacksRef.current.onGameStart) {
            callbacksRef.current.onGameStart(data.players);
          }
          break;

        case 'game_action':
          if (callbacksRef.current.onGameAction) {
            callbacksRef.current.onGameAction(data.action, data.playerId);
          }
          break;

        case 'state_sync':
          // Update room players if provided (for ID mapping)
          if (data.players) {
            setRoom(prev => prev ? { ...prev, players: data.players } : null);
          }
          if (callbacksRef.current.onStateSync) {
            callbacksRef.current.onStateSync(data.state);
          }
          break;

        case 'error':
          setError(data.message);
          if (callbacksRef.current.onError) {
            callbacksRef.current.onError(data.message);
          }
          break;
      }
    });

    setSocket(ws);

    return () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
      ws.close();
    };
  }, [roomId, playerId, playerName]);

  const startGame = useCallback(() => {
    if (socket && connected) {
      socket.send(JSON.stringify({ type: 'start_game' }));
    }
  }, [socket, connected]);

  const sendAction = useCallback((action: GameAction) => {
    if (socket && connected) {
      socket.send(JSON.stringify({
        type: 'game_action',
        action,
        playerId,
      }));
    }
  }, [socket, connected, playerId]);

  const syncState = useCallback((state: GameState) => {
    if (socket && connected) {
      socket.send(JSON.stringify({
        type: 'sync_state',
        state,
      }));
    }
  }, [socket, connected]);

  const isHost = room?.hostId === playerId;

  return {
    connected,
    room,
    error,
    isHost,
    startGame,
    sendAction,
    syncState,
  };
}

// Generate a unique player ID
export function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a room code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
