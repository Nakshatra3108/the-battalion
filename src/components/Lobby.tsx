'use client';

import React, { useState, useEffect } from 'react';
import { generatePlayerId, generateRoomCode } from '@/lib/useMultiplayer';
import { PLAYER_COLORS } from '@/types/game';
import { gameTitle, gameSubtitle } from '@/data/displayNames';
import Tutorial from './Tutorial';

interface LobbyProps {
  onJoinRoom: (roomId: string, playerId: string, playerName: string) => void;
  onPlayLocal: () => void;
}

export default function Lobby({ onJoinRoom, onPlayLocal }: LobbyProps) {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    let storedId = sessionStorage.getItem('shasn_player_id');
    if (!storedId) {
      storedId = generatePlayerId();
      sessionStorage.setItem('shasn_player_id', storedId);
    }
    setPlayerId(storedId);
    const storedName = localStorage.getItem('shasn_player_name');
    if (storedName) setPlayerName(storedName);
  }, []);

  const handleCreateRoom = () => {
    if (!playerName.trim()) { alert('Please enter your name'); return; }
    localStorage.setItem('shasn_player_name', playerName);
    onJoinRoom(generateRoomCode(), playerId, playerName);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) { alert('Please enter your name'); return; }
    if (!roomCode.trim()) { alert('Please enter a room code'); return; }
    localStorage.setItem('shasn_player_name', playerName);
    onJoinRoom(roomCode.toUpperCase(), playerId, playerName);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-mono">
      {/* Animated 3D Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(76, 175, 80, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(76, 175, 80, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center top',
          }}
        />

        {/* Floating 3D cubes */}
        <div className="absolute top-20 left-[10%] w-16 h-16 border border-[#4caf50]/30 animate-float" style={{ animationDelay: '0s' }}>
          <div className="absolute inset-0 border border-[#4caf50]/20 transform translate-x-2 translate-y-2" />
        </div>
        <div className="absolute top-40 right-[15%] w-12 h-12 border border-[#f44336]/30 animate-float" style={{ animationDelay: '1s' }}>
          <div className="absolute inset-0 border border-[#f44336]/20 transform translate-x-2 translate-y-2" />
        </div>
        <div className="absolute bottom-32 left-[20%] w-20 h-20 border border-[#4caf50]/20 animate-float" style={{ animationDelay: '2s' }}>
          <div className="absolute inset-0 border border-[#4caf50]/10 transform translate-x-3 translate-y-3" />
        </div>
        <div className="absolute bottom-20 right-[25%] w-14 h-14 border border-[#f44336]/20 animate-float" style={{ animationDelay: '0.5s' }}>
          <div className="absolute inset-0 border border-[#f44336]/10 transform translate-x-2 translate-y-2" />
        </div>

        {/* Radar circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] border border-[#4caf50]/10 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-[400px] h-[400px] m-auto border border-[#4caf50]/15 rounded-full" />
          <div className="absolute inset-0 w-[200px] h-[200px] m-auto border border-[#4caf50]/20 rounded-full" />
        </div>

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#4caf50]/30 to-transparent animate-scan" />
        </div>
      </div>

      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}

      {/* Main Card */}
      <div className="relative bg-[#0a0a0a] border-2 border-[#4caf50] rounded-lg p-8 max-w-md w-full shadow-[0_0_40px_rgba(76,175,80,0.2)]">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#4caf50]" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#4caf50]" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#4caf50]" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#4caf50]" />

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#4caf50] mb-2 tracking-widest glow-green animate-pulse">
            {gameTitle}
          </h1>
          <p className="text-[#4caf50]/60 uppercase tracking-[0.3em] text-sm">{gameSubtitle}</p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#4caf50] to-transparent" />
        </div>

        {mode === 'select' && (
          <div className="space-y-3">
            <button
              onClick={() => setShowTutorial(true)}
              className="w-full py-3 bg-[#0a0a0a] hover:bg-[#4caf50]/20 border border-[#f44336] text-[#f44336] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_15px_rgba(244,67,54,0.3)]"
            >
              [ HOW TO PLAY ]
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4caf50]/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-4 text-[#4caf50]/80 text-xs uppercase tracking-widest">OPERATIONS</span>
              </div>
            </div>

            <button
              onClick={() => setMode('create')}
              className="w-full py-4 bg-[#0a0a0a] hover:bg-[#4caf50]/20 border border-[#4caf50] text-[#4caf50] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_15px_rgba(76,175,80,0.3)] flex items-center justify-center gap-3"
            >
              <span className="text-xl">◆</span> CREATE ROOM
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full py-4 bg-[#0a0a0a] hover:bg-[#4caf50]/20 border border-[#4caf50]/60 text-[#4caf50] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_15px_rgba(76,175,80,0.2)] flex items-center justify-center gap-3"
            >
              <span className="text-xl">▶</span> JOIN ROOM
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4caf50]/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-4 text-[#4caf50]/80 text-xs uppercase tracking-widest">LOCAL</span>
              </div>
            </div>

            <button
              onClick={() => onPlayLocal()}
              className="w-full py-3 bg-[#0a0a0a] hover:bg-[#4caf50]/10 border border-[#4caf50]/30 text-[#4caf50]/70 uppercase tracking-wider rounded transition-all flex items-center justify-center gap-3"
            >
              <span className="text-lg">■</span> LOCAL MULTIPLAYER
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4caf50]/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-4 text-[#4caf50]/80 text-xs uppercase tracking-widest">COMMUNITY</span>
              </div>
            </div>

            <a
              href="https://discord.gg/mNXK4ejYpf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#0a0a0a] hover:bg-[#5865F2]/20 border border-[#5865F2] text-[#5865F2] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_15px_rgba(88,101,242,0.3)] flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              JOIN DISCORD
            </a>

            <button
              onClick={() => {
                window.location.href = 'mailto:theplotarmour@gmail.com?subject=Bug%20Report%20-%20The%20Battalion';
              }}
              className="w-full py-3 bg-[#0a0a0a] hover:bg-[#f44336]/20 border border-[#f44336]/50 text-[#f44336]/80 hover:text-[#f44336] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_15px_rgba(244,67,54,0.3)] flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              REPORT A BUG
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <button onClick={() => setMode('select')} className="text-[#4caf50]/60 hover:text-[#4caf50] text-sm flex items-center gap-1 uppercase tracking-wider">
              ← BACK
            </button>

            <h2 className="text-xl font-bold text-[#4caf50] uppercase tracking-widest">CREATE ROOM</h2>

            <div>
              <label className="block text-[#4caf50]/60 text-xs mb-2 uppercase tracking-wider">AGENT CODENAME</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter codename..."
                className="w-full bg-[#0a0a0a] text-[#4caf50] px-4 py-3 rounded border border-[#4caf50]/50 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_10px_rgba(76,175,80,0.3)] placeholder-[#4caf50]/30 font-mono"
                maxLength={20}
              />
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full py-4 bg-[#4caf50] hover:bg-[#66bb6a] text-[#0a0a0a] uppercase tracking-wider font-bold rounded transition-all shadow-[0_0_20px_rgba(76,175,80,0.4)]"
            >
              INITIALIZE ROOM
            </button>

            <p className="text-[#4caf50]/70 text-xs text-center uppercase tracking-wider">
              Room code will be generated automatically
            </p>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <button onClick={() => setMode('select')} className="text-[#4caf50]/60 hover:text-[#4caf50] text-sm flex items-center gap-1 uppercase tracking-wider">
              ← BACK
            </button>

            <h2 className="text-xl font-bold text-[#4caf50] uppercase tracking-widest">JOIN ROOM</h2>

            <div>
              <label className="block text-[#4caf50]/60 text-xs mb-2 uppercase tracking-wider">AGENT CODENAME</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter codename..."
                className="w-full bg-[#0a0a0a] text-[#4caf50] px-4 py-3 rounded border border-[#4caf50]/50 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_10px_rgba(76,175,80,0.3)] placeholder-[#4caf50]/30 font-mono"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-[#4caf50]/60 text-xs mb-2 uppercase tracking-wider">ACCESS CODE</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                className="w-full bg-[#0a0a0a] text-[#4caf50] px-4 py-3 rounded border border-[#4caf50]/50 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_10px_rgba(76,175,80,0.3)] text-center text-2xl tracking-[0.5em] font-mono placeholder-[#4caf50]/30"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full py-4 bg-[#4caf50] hover:bg-[#66bb6a] text-[#0a0a0a] uppercase tracking-wider font-bold rounded transition-all shadow-[0_0_20px_rgba(76,175,80,0.4)]"
            >
              CONNECT
            </button>
          </div>
        )}
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
