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
  const [showBugReport, setShowBugReport] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

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
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden font-mono">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] via-[#050508] to-[#0a0812] animate-gradient-shift" />

      {/* Perspective grid floor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[200%] h-[200%] left-[-50%] top-[30%] opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(76, 175, 80, 0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(76, 175, 80, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(500px) rotateX(65deg)',
            transformOrigin: 'center top',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          }}
        />
      </div>

      {/* Floating 3D Cubes - Various colors and sizes */}
      {/* Green cubes */}
      <div className="absolute top-[8%] left-[8%] w-20 h-20 animate-float-slow preserve-3d" style={{ animationDelay: '0s' }}>
        <div className="absolute inset-0 border-2 border-[#4caf50]/60 bg-[#4caf50]/10 backdrop-blur-sm shadow-[0_0_30px_rgba(76,175,80,0.3)]" />
        <div className="absolute inset-0 border-2 border-[#4caf50]/30 bg-[#4caf50]/5 transform translate-x-3 translate-y-3 -translate-z-3" />
        <div className="absolute inset-0 border border-[#4caf50]/15 transform translate-x-6 translate-y-6 -translate-z-6" />
      </div>

      <div className="absolute top-[15%] right-[12%] w-14 h-14 animate-float-medium preserve-3d" style={{ animationDelay: '1.5s' }}>
        <div className="absolute inset-0 border-2 border-[#4caf50]/50 bg-[#4caf50]/10 backdrop-blur-sm shadow-[0_0_20px_rgba(76,175,80,0.2)]" />
        <div className="absolute inset-0 border border-[#4caf50]/25 transform translate-x-2 translate-y-2" />
      </div>

      <div className="absolute bottom-[20%] left-[5%] w-16 h-16 animate-float-medium preserve-3d" style={{ animationDelay: '0.8s' }}>
        <div className="absolute inset-0 border-2 border-[#4caf50]/40 bg-[#4caf50]/5 shadow-[0_0_25px_rgba(76,175,80,0.2)]" />
        <div className="absolute inset-0 border border-[#4caf50]/20 transform translate-x-2.5 translate-y-2.5" />
      </div>

      {/* Red/Orange cubes */}
      <div className="absolute top-[25%] right-[6%] w-24 h-24 animate-float-slow preserve-3d" style={{ animationDelay: '2s' }}>
        <div className="absolute inset-0 border-2 border-[#f44336]/50 bg-[#f44336]/10 backdrop-blur-sm shadow-[0_0_35px_rgba(244,67,54,0.3)]" />
        <div className="absolute inset-0 border-2 border-[#f44336]/25 bg-[#f44336]/5 transform translate-x-4 translate-y-4" />
        <div className="absolute inset-0 border border-[#f44336]/10 transform translate-x-8 translate-y-8" />
      </div>

      <div className="absolute bottom-[12%] right-[15%] w-12 h-12 animate-float-fast preserve-3d" style={{ animationDelay: '0.5s' }}>
        <div className="absolute inset-0 border-2 border-[#ff5722]/60 bg-[#ff5722]/10 shadow-[0_0_20px_rgba(255,87,34,0.3)]" />
        <div className="absolute inset-0 border border-[#ff5722]/30 transform translate-x-2 translate-y-2" />
      </div>

      {/* Blue/Cyan cubes */}
      <div className="absolute top-[45%] left-[3%] w-18 h-18 animate-float-medium preserve-3d" style={{ animationDelay: '1s' }}>
        <div className="absolute inset-0 w-[72px] h-[72px] border-2 border-[#2196f3]/50 bg-[#2196f3]/10 backdrop-blur-sm shadow-[0_0_25px_rgba(33,150,243,0.3)]" />
        <div className="absolute inset-0 w-[72px] h-[72px] border border-[#2196f3]/25 transform translate-x-3 translate-y-3" />
      </div>

      <div className="absolute bottom-[35%] right-[4%] w-14 h-14 animate-float-slow preserve-3d" style={{ animationDelay: '2.5s' }}>
        <div className="absolute inset-0 border-2 border-[#00bcd4]/50 bg-[#00bcd4]/10 shadow-[0_0_20px_rgba(0,188,212,0.25)]" />
        <div className="absolute inset-0 border border-[#00bcd4]/25 transform translate-x-2 translate-y-2" />
      </div>

      {/* Purple cubes */}
      <div className="absolute top-[60%] right-[8%] w-16 h-16 animate-float-medium preserve-3d" style={{ animationDelay: '1.8s' }}>
        <div className="absolute inset-0 border-2 border-[#9c27b0]/50 bg-[#9c27b0]/10 backdrop-blur-sm shadow-[0_0_25px_rgba(156,39,176,0.3)]" />
        <div className="absolute inset-0 border border-[#9c27b0]/25 transform translate-x-2.5 translate-y-2.5" />
      </div>

      <div className="absolute bottom-[25%] left-[12%] w-10 h-10 animate-float-fast preserve-3d" style={{ animationDelay: '0.3s' }}>
        <div className="absolute inset-0 border-2 border-[#673ab7]/60 bg-[#673ab7]/15 shadow-[0_0_15px_rgba(103,58,183,0.3)]" />
        <div className="absolute inset-0 border border-[#673ab7]/30 transform translate-x-1.5 translate-y-1.5" />
      </div>

      {/* Yellow/Gold cubes */}
      <div className="absolute top-[12%] left-[25%] w-12 h-12 animate-float-fast preserve-3d" style={{ animationDelay: '1.2s' }}>
        <div className="absolute inset-0 border-2 border-[#ffc107]/60 bg-[#ffc107]/10 shadow-[0_0_20px_rgba(255,193,7,0.3)]" />
        <div className="absolute inset-0 border border-[#ffc107]/30 transform translate-x-2 translate-y-2" />
      </div>

      <div className="absolute bottom-[8%] left-[30%] w-14 h-14 animate-float-medium preserve-3d" style={{ animationDelay: '2.2s' }}>
        <div className="absolute inset-0 border-2 border-[#ffeb3b]/50 bg-[#ffeb3b]/10 shadow-[0_0_20px_rgba(255,235,59,0.25)]" />
        <div className="absolute inset-0 border border-[#ffeb3b]/25 transform translate-x-2 translate-y-2" />
      </div>

      {/* Small floating particles/dots */}
      <div className="absolute top-[20%] left-[40%] w-2 h-2 bg-[#4caf50] rounded-full animate-pulse-glow shadow-[0_0_10px_#4caf50,0_0_20px_#4caf50]" />
      <div className="absolute top-[35%] right-[30%] w-1.5 h-1.5 bg-[#f44336] rounded-full animate-pulse-glow shadow-[0_0_8px_#f44336]" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-[40%] left-[20%] w-2 h-2 bg-[#2196f3] rounded-full animate-pulse-glow shadow-[0_0_10px_#2196f3]" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[50%] left-[15%] w-1.5 h-1.5 bg-[#9c27b0] rounded-full animate-pulse-glow shadow-[0_0_8px_#9c27b0]" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[30%] right-[25%] w-2 h-2 bg-[#ffc107] rounded-full animate-pulse-glow shadow-[0_0_10px_#ffc107]" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[70%] right-[35%] w-1.5 h-1.5 bg-[#00bcd4] rounded-full animate-pulse-glow shadow-[0_0_8px_#00bcd4]" style={{ animationDelay: '0.8s' }} />

      {/* Floating lines/streaks */}
      <div className="absolute top-[30%] left-[35%] w-20 h-px bg-gradient-to-r from-transparent via-[#4caf50]/50 to-transparent animate-float-slow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-[45%] right-[20%] w-16 h-px bg-gradient-to-r from-transparent via-[#f44336]/50 to-transparent animate-float-medium" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[55%] left-[45%] w-24 h-px bg-gradient-to-r from-transparent via-[#2196f3]/40 to-transparent animate-float-fast" style={{ animationDelay: '2s' }} />

      {/* Corner accent lines */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-8 left-8 w-16 h-px bg-gradient-to-r from-[#4caf50] to-transparent" />
        <div className="absolute top-8 left-8 w-px h-16 bg-gradient-to-b from-[#4caf50] to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32">
        <div className="absolute top-8 right-8 w-16 h-px bg-gradient-to-l from-[#4caf50] to-transparent" />
        <div className="absolute top-8 right-8 w-px h-16 bg-gradient-to-b from-[#4caf50] to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32">
        <div className="absolute bottom-8 left-8 w-16 h-px bg-gradient-to-r from-[#4caf50] to-transparent" />
        <div className="absolute bottom-8 left-8 w-px h-16 bg-gradient-to-t from-[#4caf50] to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute bottom-8 right-8 w-16 h-px bg-gradient-to-l from-[#4caf50] to-transparent" />
        <div className="absolute bottom-8 right-8 w-px h-16 bg-gradient-to-t from-[#4caf50] to-transparent" />
      </div>

      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}

      {/* Main Card - Premium glassmorphism */}
      <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#4caf50]/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_80px_rgba(76,175,80,0.15),0_20px_60px_rgba(0,0,0,0.5)] z-10">
        {/* Animated border glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#4caf50]/0 via-[#4caf50]/50 to-[#4caf50]/0 opacity-50 blur-sm animate-border-glow" />

        {/* Inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#4caf50]/5 to-transparent pointer-events-none" />

        {/* Decorative corner accents */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#4caf50] rounded-tl-lg shadow-[0_0_15px_rgba(76,175,80,0.5)]" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#4caf50] rounded-tr-lg shadow-[0_0_15px_rgba(76,175,80,0.5)]" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#4caf50] rounded-bl-lg shadow-[0_0_15px_rgba(76,175,80,0.5)]" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#4caf50] rounded-br-lg shadow-[0_0_15px_rgba(76,175,80,0.5)]" />

        {/* Title */}
        <div className="text-center mb-8 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#4caf50] to-transparent" />

          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#4caf50] via-[#66bb6a] to-[#4caf50] mb-3 tracking-wider animate-title-shimmer">
            {gameTitle}
          </h1>
          <p className="text-[#4caf50]/70 uppercase tracking-[0.5em] text-xs font-medium">{gameSubtitle}</p>

          {/* Decorative diamonds */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-1 h-1 bg-[#4caf50]/40 rotate-45" />
            <div className="w-1.5 h-1.5 bg-[#4caf50]/60 rotate-45" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#4caf50]/60 to-transparent" />
            <div className="w-2 h-2 bg-[#4caf50] rotate-45 shadow-[0_0_10px_#4caf50]" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#4caf50]/60 to-transparent" />
            <div className="w-1.5 h-1.5 bg-[#4caf50]/60 rotate-45" />
            <div className="w-1 h-1 bg-[#4caf50]/40 rotate-45" />
          </div>
        </div>

        {mode === 'select' && (
          <div className="space-y-3 relative">
            <button
              onClick={() => setShowTutorial(true)}
              className="w-full py-3.5 bg-gradient-to-r from-[#f44336]/10 to-[#ff5722]/10 hover:from-[#f44336]/20 hover:to-[#ff5722]/20 border border-[#f44336]/70 text-[#f44336] uppercase tracking-wider font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(244,67,54,0.3)] hover:scale-[1.02] active:scale-[0.98] hover:border-[#f44336]"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xs">◆</span>
                HOW TO PLAY
                <span className="text-xs">◆</span>
              </span>
            </button>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4caf50]/40 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-5 text-[#4caf50] text-[10px] uppercase tracking-[0.3em] font-bold">Multiplayer</span>
              </div>
            </div>

            <button
              onClick={() => setMode('create')}
              className="w-full py-4 bg-gradient-to-r from-[#4caf50]/20 to-[#66bb6a]/20 hover:from-[#4caf50]/30 hover:to-[#66bb6a]/30 border border-[#4caf50] text-[#4caf50] uppercase tracking-wider font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_35px_rgba(76,175,80,0.4)] hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 bg-[#4caf50] rounded-full group-hover:shadow-[0_0_10px_#4caf50] transition-shadow" />
                CREATE ROOM
              </span>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full py-4 bg-[#0a0a0a]/50 hover:bg-[#4caf50]/10 border border-[#4caf50]/50 hover:border-[#4caf50] text-[#4caf50]/90 hover:text-[#4caf50] uppercase tracking-wider font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(76,175,80,0.25)] hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#4caf50]/70 group-hover:border-l-[#4caf50] transition-colors" />
                JOIN ROOM
              </span>
            </button>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4caf50]/40 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-5 text-[#4caf50] text-[10px] uppercase tracking-[0.3em] font-bold">Local</span>
              </div>
            </div>

            <button
              onClick={() => onPlayLocal()}
              className="w-full py-3.5 bg-[#0a0a0a]/30 hover:bg-[#4caf50]/10 border border-[#4caf50]/30 hover:border-[#4caf50]/60 text-[#4caf50]/70 hover:text-[#4caf50] uppercase tracking-wider font-medium rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(76,175,80,0.15)]"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="w-2.5 h-2.5 border border-[#4caf50]/50 rounded-sm" />
                LOCAL MULTIPLAYER
              </span>
            </button>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#4caf50]/40 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-5 text-[#4caf50] text-[10px] uppercase tracking-[0.3em] font-bold">Community</span>
              </div>
            </div>

            <a
              href="https://discord.gg/mNXK4ejYpf"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 bg-gradient-to-r from-[#5865F2]/10 to-[#7289da]/10 hover:from-[#5865F2]/20 hover:to-[#7289da]/20 border border-[#5865F2]/70 hover:border-[#5865F2] text-[#5865F2] uppercase tracking-wider font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(88,101,242,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                JOIN DISCORD
              </span>
            </a>

            <button
              onClick={() => setShowBugReport(true)}
              className="w-full py-3 bg-transparent hover:bg-[#f44336]/10 border border-[#f44336]/30 hover:border-[#f44336]/60 text-[#f44336]/60 hover:text-[#f44336] uppercase tracking-wider text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Report Bug
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-5 relative">
            <button onClick={() => setMode('select')} className="text-[#4caf50]/60 hover:text-[#4caf50] text-sm flex items-center gap-2 uppercase tracking-wider transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
            </button>

            <h2 className="text-2xl font-bold text-[#4caf50] uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-[#4caf50] rounded-full shadow-[0_0_10px_#4caf50]" />
              Create Room
            </h2>

            <div>
              <label className="block text-[#4caf50]/60 text-xs mb-2 uppercase tracking-wider">Agent Codename</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter codename..."
                className="w-full bg-[#0a0a0a]/50 text-[#4caf50] px-4 py-3.5 rounded-xl border border-[#4caf50]/40 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_25px_rgba(76,175,80,0.2)] placeholder-[#4caf50]/25 font-mono transition-all"
                maxLength={20}
              />
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full py-4 bg-gradient-to-r from-[#4caf50] to-[#66bb6a] hover:from-[#66bb6a] hover:to-[#81c784] text-[#0a0a0a] uppercase tracking-wider font-bold rounded-xl transition-all duration-300 shadow-[0_0_40px_rgba(76,175,80,0.4)] hover:shadow-[0_0_50px_rgba(76,175,80,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Initialize Room
            </button>

            <p className="text-[#4caf50]/40 text-xs text-center uppercase tracking-wider">
              Room code will be generated automatically
            </p>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-5 relative">
            <button onClick={() => setMode('select')} className="text-[#4caf50]/60 hover:text-[#4caf50] text-sm flex items-center gap-2 uppercase tracking-wider transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
            </button>

            <h2 className="text-2xl font-bold text-[#4caf50] uppercase tracking-widest flex items-center gap-3">
              <span className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-[#4caf50]" />
              Join Room
            </h2>

            <div>
              <label className="block text-[#4caf50]/60 text-xs mb-2 uppercase tracking-wider">Agent Codename</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter codename..."
                className="w-full bg-[#0a0a0a]/50 text-[#4caf50] px-4 py-3.5 rounded-xl border border-[#4caf50]/40 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_25px_rgba(76,175,80,0.2)] placeholder-[#4caf50]/25 font-mono transition-all"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-[#4caf50]/60 text-xs mb-2 uppercase tracking-wider">Access Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                className="w-full bg-[#0a0a0a]/50 text-[#4caf50] px-4 py-3.5 rounded-xl border border-[#4caf50]/40 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_25px_rgba(76,175,80,0.2)] text-center text-2xl tracking-[0.5em] font-mono placeholder-[#4caf50]/25 transition-all"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full py-4 bg-gradient-to-r from-[#4caf50] to-[#66bb6a] hover:from-[#66bb6a] hover:to-[#81c784] text-[#0a0a0a] uppercase tracking-wider font-bold rounded-xl transition-all duration-300 shadow-[0_0_40px_rgba(76,175,80,0.4)] hover:shadow-[0_0_50px_rgba(76,175,80,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Connect
            </button>
          </div>
        )}

        {/* Bottom accent */}
        <div className="absolute -bottom-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#4caf50]/50 to-transparent" />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(3deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-2deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes title-shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
        @keyframes border-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-title-shimmer {
          animation: title-shimmer 4s ease-in-out infinite;
        }
        .animate-border-glow {
          animation: border-glow 3s ease-in-out infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Bug Report Modal */}
      {showBugReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowBugReport(false)}>
          <div
            className="bg-[#0a0a0a] border border-[#f44336]/50 rounded-2xl p-6 max-w-md mx-4 shadow-[0_0_60px_rgba(244,67,54,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#f44336] uppercase tracking-widest mb-4 text-center">Report a Bug</h3>
            <p className="text-gray-400 text-sm mb-4 text-center">Send your bug report to:</p>

            <div className="bg-[#0a0a0a] border border-[#4caf50]/40 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
              <span className="text-[#4caf50] font-mono select-all">theplotarmour@gmail.com</span>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText('theplotarmour@gmail.com');
                    setEmailCopied(true);
                    setTimeout(() => setEmailCopied(false), 2000);
                  } catch (e) {
                    const textArea = document.createElement('textarea');
                    textArea.value = 'theplotarmour@gmail.com';
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    setEmailCopied(true);
                    setTimeout(() => setEmailCopied(false), 2000);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-bold uppercase text-sm transition-all ${emailCopied
                    ? 'bg-[#4caf50] text-black'
                    : 'bg-[#4caf50]/20 text-[#4caf50] hover:bg-[#4caf50]/30'
                  }`}
              >
                {emailCopied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            <button
              onClick={() => setShowBugReport(false)}
              className="w-full py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl uppercase tracking-wider font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
