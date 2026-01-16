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
  disconnectedAt?: number;
}

interface RoomInfo {
  players: PlayerInfo[];
  gameStarted: boolean;
  hostId: string | null;
}

// Info about a player who is temporarily disconnected but within grace period
interface DisconnectedPlayer {
  playerId: string;
  playerName: string;
  disconnectedAt: number;
  gracePeriodMs: number;
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
  onPlayerDisconnecting?: (playerId: string, playerName: string, gracePeriodMs: number) => void;
  onPlayerReconnected?: (playerId: string, playerName: string) => void;
  onRoomReset?: (reason: string) => void;
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
  onPlayerDisconnecting,
  onPlayerReconnected,
  onRoomReset,
}: UseMultiplayerOptions) {
  const [socket, setSocket] = useState<PartySocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [disconnectedPlayers, setDisconnectedPlayers] = useState<DisconnectedPlayer[]>([]);

  const callbacksRef = useRef({
    onGameStart, onGameAction, onStateSync, onError, onPlayerLeft,
    onPlayerDisconnecting, onPlayerReconnected, onRoomReset
  });
  callbacksRef.current = {
    onGameStart, onGameAction, onStateSync, onError, onPlayerLeft,
    onPlayerDisconnecting, onPlayerReconnected, onRoomReset
  };

  useEffect(() => {
    if (!roomId || !playerId) return;

    const ws = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
      // Configure reconnection behavior for international connections
      maxRetries: 20, // Increased from 10 for better resilience
      // Start with 500ms delay, exponential backoff up to 30s
      startClosed: false,
    });

    // Keep-alive ping interval - optimized for high-latency international connections
    let pingInterval: NodeJS.Timeout | null = null;
    let missedPongs = 0;
    const MAX_MISSED_PONGS = 6; // 6 missed pongs = 180s timeout before forced reconnect
    const PING_INTERVAL_MS = 30000; // 30 seconds between pings

    ws.addEventListener('open', () => {
      console.log('[useMultiplayer] Connected to server');
      setConnected(true);
      setReconnecting(false);
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

      // Start ping interval to keep connection alive
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          missedPongs++;
          if (missedPongs > MAX_MISSED_PONGS) {
            // Connection seems dead, force reconnect
            console.warn('[useMultiplayer] Too many missed pongs, reconnecting...');
            setReconnecting(true);
            ws.reconnect();
            missedPongs = 0;
          } else {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }
      }, PING_INTERVAL_MS);
    });

    ws.addEventListener('close', (event) => {
      console.log('[useMultiplayer] Connection closed, code:', event.code);
      setConnected(false);
      setReconnecting(true); // Show reconnecting state
      // Don't clear ping interval - PartySocket will auto-reconnect
    });

    ws.addEventListener('error', (event) => {
      console.error('[useMultiplayer] Connection error:', event);
      setError('Connection error - reconnecting...');
      setReconnecting(true);
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

        case 'player_disconnecting':
          // A player has lost connection but is in grace period
          setDisconnectedPlayers(prev => {
            // Remove any existing entry for this player
            const filtered = prev.filter(p => p.playerId !== data.playerId);
            return [...filtered, {
              playerId: data.playerId,
              playerName: data.playerName,
              disconnectedAt: Date.now(),
              gracePeriodMs: data.gracePeriodMs,
            }];
          });
          if (callbacksRef.current.onPlayerDisconnecting) {
            callbacksRef.current.onPlayerDisconnecting(data.playerId, data.playerName, data.gracePeriodMs);
          }
          break;

        case 'player_reconnected':
          // A player successfully reconnected within grace period
          setDisconnectedPlayers(prev => prev.filter(p => p.playerId !== data.playerId));
          setRoom(prev => prev ? { ...prev, players: data.players } : null);
          if (callbacksRef.current.onPlayerReconnected) {
            callbacksRef.current.onPlayerReconnected(data.playerId, data.playerName);
          }
          break;

        case 'player_left':
          // Player has been fully removed (grace period expired or game not started)
          setDisconnectedPlayers(prev => prev.filter(p => p.playerId !== data.playerId));
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
          console.log('[useMultiplayer] Successfully rejoined game');
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

        case 'room_reset':
          // Room has been reset (game over, or all players left)
          console.log('[useMultiplayer] Room reset:', data.reason);
          setRoom(null);
          setDisconnectedPlayers([]);
          if (callbacksRef.current.onRoomReset) {
            callbacksRef.current.onRoomReset(data.reason);
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

  // Explicitly leave the game (bypasses grace period for immediate removal)
  const leaveGame = useCallback(() => {
    if (socket) {
      // Send leave message before closing
      socket.send(JSON.stringify({
        type: 'leave_game',
        playerId,
      }));
      // Close the socket after a brief delay to ensure message is sent
      setTimeout(() => {
        socket.close();
      }, 100);
    }
  }, [socket, playerId]);

  const isHost = room?.hostId === playerId;

  return {
    connected,
    reconnecting,
    room,
    error,
    isHost,
    disconnectedPlayers,
    startGame,
    sendAction,
    syncState,
    leaveGame,
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

