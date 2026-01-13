'use client';

import React, { useState } from 'react';
import { PLAYER_COLORS } from '@/types/game';

interface PlayerInfo {
  id: string;
  name: string;
  connectionId: string;
  isHost: boolean;
  isReady: boolean;
}

interface WaitingRoomProps {
  roomCode: string;
  players: PlayerInfo[];
  currentPlayerId: string;
  isHost: boolean;
  connected: boolean;
  error: string | null;
  onStart: () => void;
  onLeave: () => void;
}

export default function WaitingRoom({
  roomCode,
  players,
  currentPlayerId,
  isHost,
  connected,
  error,
  onStart,
  onLeave,
}: WaitingRoomProps) {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = roomCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canStart = players.length >= 2 && players.length <= 5;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-mono">
      <div className="bg-[#0a0a0a] border-2 border-[#4caf50] rounded-lg p-8 max-w-md w-full shadow-[0_0_30px_rgba(76,175,80,0.2)] relative">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#4caf50]" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#4caf50]" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#4caf50]" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#4caf50]" />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#4caf50] mb-2 uppercase tracking-widest" style={{ textShadow: '0 0 10px rgba(76,175,80,0.5)' }}>
            STAGING AREA
          </h1>

          {/* Room Code */}
          <div className="bg-black/50 border border-[#4caf50]/40 rounded p-4 mb-4">
            <p className="text-[#4caf50]/60 text-xs mb-2 uppercase tracking-wider">ACCESS CODE</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-mono font-bold text-[#4caf50] tracking-[0.5em]" style={{ textShadow: '0 0 15px rgba(76,175,80,0.8)' }}>
                {roomCode}
              </span>
              <button
                onClick={copyRoomCode}
                className="p-2 bg-[#0a0a0a] hover:bg-[#4caf50]/20 border border-[#4caf50]/50 rounded transition-colors text-[#4caf50]"
                title="Copy room code"
              >
                {copied ? '✓' : '⧉'}
              </button>
            </div>
            <p className="text-[#4caf50]/70 text-xs mt-2 uppercase tracking-wider">
              Share with operatives
            </p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-[#4caf50] shadow-[0_0_8px_#4caf50]' : 'bg-[#f44336] shadow-[0_0_8px_#f44336]'}`} />
            <span className={`text-xs uppercase tracking-wider ${connected ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
              {connected ? 'LINK ESTABLISHED' : 'CONNECTING...'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#f44336]/10 border border-[#f44336] rounded p-3 mb-4">
            <p className="text-[#f44336] text-sm">{error}</p>
          </div>
        )}

        {/* Players List */}
        <div className="mb-6">
          <h3 className="text-[#4caf50]/60 text-xs mb-3 uppercase tracking-wider">
            OPERATIVES [{players.length}/5]
          </h3>
          <div className="space-y-2">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`
                  flex items-center justify-between p-3 rounded border transition-all
                  ${player.id === currentPlayerId
                    ? 'bg-[#4caf50]/10 border-[#4caf50]'
                    : 'bg-black/30 border-[#4caf50]/30'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: PLAYER_COLORS[index], boxShadow: `0 0 8px ${PLAYER_COLORS[index]}` }}
                  />
                  <span className="text-[#e0e0e0] font-bold uppercase tracking-wider">
                    {player.name}
                    {player.id === currentPlayerId && (
                      <span className="text-[#4caf50]/60 text-xs ml-2">[YOU]</span>
                    )}
                  </span>
                </div>
                {player.isHost && (
                  <span className="text-xs bg-[#f44336] text-[#0a0a0a] px-2 py-0.5 rounded font-bold uppercase">
                    HOST
                  </span>
                )}
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 5 - players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center p-3 rounded border-2 border-dashed border-[#4caf50]/20"
              >
                <span className="text-[#4caf50]/60 uppercase tracking-wider text-sm">Awaiting operative...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isHost ? (
            <>
              <button
                onClick={onStart}
                disabled={!canStart}
                className={`
                  w-full py-4 text-lg font-bold rounded uppercase tracking-wider transition-all
                  ${canStart
                    ? 'bg-[#4caf50] hover:bg-[#66bb6a] text-[#0a0a0a] shadow-[0_0_20px_rgba(76,175,80,0.4)]'
                    : 'bg-[#1a1a1a] text-[#4caf50]/60 cursor-not-allowed border border-[#4caf50]/20'}
                `}
              >
                {canStart ? 'COMMENCE OPERATION' : `NEED ${2 - players.length} MORE`}
              </button>
              <p className="text-[#4caf50]/70 text-xs text-center uppercase tracking-wider">
                You are commanding. Deploy when ready.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-[#4caf50]/60 uppercase tracking-wider">
                Awaiting host command...
              </p>
            </div>
          )}

          <button
            onClick={onLeave}
            className="w-full py-2 bg-[#0a0a0a] hover:bg-[#f44336]/20 border border-[#f44336]/50 text-[#f44336] rounded uppercase tracking-wider transition-all"
          >
            ABORT MISSION
          </button>
        </div>
      </div>
    </div>
  );
}
