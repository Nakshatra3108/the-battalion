'use client';

import React, { useState, useEffect, useRef } from 'react';
import { generatePlayerId, generateRoomCode } from '@/lib/useMultiplayer';
import { PLAYER_COLORS } from '@/types/game';
import { gameTitle, gameSubtitle } from '@/data/displayNames';
import Tutorial from './Tutorial';

interface LobbyProps {
  onJoinRoom: (roomId: string, playerId: string, playerName: string) => void;
  onPlayLocal: () => void;
}

// Radar blip component
function RadarBlip({ delay, distance, angle }: { delay: number; distance: number; angle: number }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full bg-[#4caf50] animate-blip"
      style={{
        left: `calc(50% + ${Math.cos(angle) * distance}px)`,
        top: `calc(50% + ${Math.sin(angle) * distance}px)`,
        animationDelay: `${delay}s`,
        boxShadow: '0 0 10px #4caf50, 0 0 20px #4caf50',
      }}
    />
  );
}

export default function Lobby({ onJoinRoom, onPlayLocal }: LobbyProps) {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [blips, setBlips] = useState<Array<{ id: number; delay: number; distance: number; angle: number }>>([]);

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

  // Generate random blips periodically
  useEffect(() => {
    const generateBlip = () => {
      const newBlip = {
        id: Date.now(),
        delay: 0,
        distance: 80 + Math.random() * 200,
        angle: Math.random() * Math.PI * 2,
      };
      setBlips(prev => [...prev.slice(-8), newBlip]);
    };

    generateBlip();
    const interval = setInterval(generateBlip, 2000);
    return () => clearInterval(interval);
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
      {/* Full Screen Radar Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Radar Container */}
        <div className="relative w-[800px] h-[800px]">
          {/* Radar circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-[700px] h-[700px] border border-[#4caf50]/20 rounded-full" />
            <div className="absolute w-[525px] h-[525px] border border-[#4caf50]/25 rounded-full" />
            <div className="absolute w-[350px] h-[350px] border border-[#4caf50]/30 rounded-full" />
            <div className="absolute w-[175px] h-[175px] border border-[#4caf50]/35 rounded-full" />
          </div>

          {/* Radar cross lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#4caf50]/30 to-transparent" />
            <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-[#4caf50]/30 to-transparent" />
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#4caf50]/20 to-transparent rotate-45" />
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#4caf50]/20 to-transparent -rotate-45" />
          </div>

          {/* Radar sweep line with glow trail */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute w-full h-full animate-radar-sweep"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, transparent 350deg, rgba(76, 175, 80, 0.4) 355deg, rgba(76, 175, 80, 0.8) 358deg, #4caf50 360deg)',
                borderRadius: '50%',
                maskImage: 'radial-gradient(circle, black 0%, black 49%, transparent 50%)',
                WebkitMaskImage: 'radial-gradient(circle, black 0%, black 49%, transparent 50%)',
              }}
            />
            {/* Sweep line */}
            <div
              className="absolute h-[350px] w-1 origin-bottom animate-radar-sweep"
              style={{
                background: 'linear-gradient(to top, #4caf50, transparent)',
                bottom: '50%',
                left: 'calc(50% - 2px)',
                boxShadow: '0 0 20px #4caf50, 0 0 40px #4caf50',
              }}
            />
          </div>

          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#4caf50] rounded-full shadow-[0_0_20px_#4caf50,0_0_40px_#4caf50,0_0_60px_#4caf50]" />

          {/* Blips */}
          {blips.map(blip => (
            <RadarBlip key={blip.id} {...blip} />
          ))}
        </div>
      </div>

      {/* Scanning grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(76, 175, 80, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(76, 175, 80, 0.8) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Corner HUD Elements */}
      <div className="absolute top-4 left-4 text-[#4caf50]/60 text-xs font-mono space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#4caf50] rounded-full animate-pulse" />
          <span>SYSTEM ONLINE</span>
        </div>
        <div>LAT: 28.6139° N</div>
        <div>LON: 77.2090° E</div>
      </div>

      <div className="absolute top-4 right-4 text-[#4caf50]/60 text-xs font-mono text-right space-y-1">
        <div className="flex items-center justify-end gap-2">
          <span>SECURE CHANNEL</span>
          <span className="w-2 h-2 bg-[#4caf50] rounded-full animate-pulse" />
        </div>
        <div>FREQ: 142.8 MHz</div>
        <div>ENCRYPTION: AES-256</div>
      </div>

      <div className="absolute bottom-4 left-4 text-[#4caf50]/60 text-xs font-mono space-y-1">
        <div>UPLINK: ACTIVE</div>
        <div>SIGNAL: ████████░░ 82%</div>
        <div className="text-[#f44336]/60">THREAT LEVEL: ELEVATED</div>
      </div>

      <div className="absolute bottom-4 right-4 text-[#4caf50]/60 text-xs font-mono text-right space-y-1">
        <div>AGENTS ONLINE: <span className="text-[#4caf50]">47</span></div>
        <div>ACTIVE OPS: <span className="text-[#f44336]">12</span></div>
        <div className="animate-pulse">◉ MONITORING</div>
      </div>

      {/* Animated corner brackets */}
      <div className="absolute top-8 left-8 w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#4caf50] to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-[#4caf50] to-transparent animate-pulse" />
      </div>
      <div className="absolute top-8 right-8 w-20 h-20">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#4caf50] to-transparent animate-pulse" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[#4caf50] to-transparent animate-pulse" />
      </div>
      <div className="absolute bottom-8 left-8 w-20 h-20">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#4caf50] to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-[#4caf50] to-transparent animate-pulse" />
      </div>
      <div className="absolute bottom-8 right-8 w-20 h-20">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-[#4caf50] to-transparent animate-pulse" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-[#4caf50] to-transparent animate-pulse" />
      </div>

      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}

      {/* Main Card */}
      <div className="relative bg-[#0a0a0a]/95 backdrop-blur-sm border-2 border-[#4caf50] rounded-lg p-8 max-w-md w-full shadow-[0_0_60px_rgba(76,175,80,0.3),inset_0_0_60px_rgba(76,175,80,0.05)] z-10">
        {/* Animated corner brackets */}
        <div className="absolute -top-1 -left-1 w-10 h-10 border-t-2 border-l-2 border-[#4caf50] shadow-[0_0_10px_#4caf50]" />
        <div className="absolute -top-1 -right-1 w-10 h-10 border-t-2 border-r-2 border-[#4caf50] shadow-[0_0_10px_#4caf50]" />
        <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-2 border-l-2 border-[#4caf50] shadow-[0_0_10px_#4caf50]" />
        <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-2 border-r-2 border-[#4caf50] shadow-[0_0_10px_#4caf50]" />

        {/* Glowing header bar */}
        <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#4caf50] to-transparent shadow-[0_0_20px_#4caf50]" />

        {/* Title */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold text-[#4caf50] mb-2 tracking-widest animate-title-glow">
              {gameTitle}
            </h1>
            {/* Title underline effect */}
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4caf50] to-transparent" />
          </div>
          <p className="text-[#4caf50]/80 uppercase tracking-[0.4em] text-sm mt-4 animate-pulse">{gameSubtitle}</p>

          {/* Decorative line with dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-[#4caf50]/40 rounded-full" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#4caf50]/60 to-transparent" />
            <div className="w-3 h-3 bg-[#4caf50] rounded-full shadow-[0_0_10px_#4caf50] animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#4caf50]/60 to-transparent" />
            <div className="w-2 h-2 bg-[#4caf50]/40 rounded-full" />
          </div>
        </div>

        {mode === 'select' && (
          <div className="space-y-3">
            <button
              onClick={() => setShowTutorial(true)}
              className="w-full py-3 bg-[#0a0a0a] hover:bg-[#f44336]/20 border-2 border-[#f44336] text-[#f44336] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_25px_rgba(244,67,54,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-lg">◈</span>
                HOW TO PLAY
                <span className="text-lg">◈</span>
              </span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4caf50]/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-4 text-[#4caf50] text-xs uppercase tracking-widest font-bold">OPERATIONS</span>
              </div>
            </div>

            <button
              onClick={() => setMode('create')}
              className="w-full py-4 bg-[#4caf50]/10 hover:bg-[#4caf50]/25 border-2 border-[#4caf50] text-[#4caf50] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_30px_rgba(76,175,80,0.4)] hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-xl group-hover:animate-pulse">◆</span>
                CREATE ROOM
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </span>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full py-4 bg-[#0a0a0a] hover:bg-[#4caf50]/15 border-2 border-[#4caf50]/70 text-[#4caf50] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_25px_rgba(76,175,80,0.3)] hover:border-[#4caf50] hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-xl group-hover:animate-pulse">▶</span>
                JOIN ROOM
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4caf50]/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-4 text-[#4caf50] text-xs uppercase tracking-widest font-bold">LOCAL</span>
              </div>
            </div>

            <button
              onClick={() => onPlayLocal()}
              className="w-full py-3 bg-[#0a0a0a] hover:bg-[#4caf50]/10 border border-[#4caf50]/50 text-[#4caf50]/80 hover:text-[#4caf50] uppercase tracking-wider rounded transition-all hover:shadow-[0_0_15px_rgba(76,175,80,0.2)] hover:border-[#4caf50] group"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-lg">■</span>
                LOCAL MULTIPLAYER
              </span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4caf50]/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-4 text-[#4caf50] text-xs uppercase tracking-widest font-bold">COMMUNITY</span>
              </div>
            </div>

            <a
              href="https://discord.gg/mNXK4ejYpf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#0a0a0a] hover:bg-[#5865F2]/20 border-2 border-[#5865F2] text-[#5865F2] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_25px_rgba(88,101,242,0.4)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              JOIN DISCORD
            </a>

            <button
              onClick={() => setShowBugReport(true)}
              className="w-full py-3 bg-[#0a0a0a] hover:bg-[#f44336]/20 border border-[#f44336]/60 text-[#f44336]/80 hover:text-[#f44336] hover:border-[#f44336] uppercase tracking-wider font-bold rounded transition-all hover:shadow-[0_0_20px_rgba(244,67,54,0.3)] flex items-center justify-center gap-3"
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
            <button onClick={() => setMode('select')} className="text-[#4caf50]/70 hover:text-[#4caf50] text-sm flex items-center gap-2 uppercase tracking-wider transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK
            </button>

            <h2 className="text-2xl font-bold text-[#4caf50] uppercase tracking-widest flex items-center gap-3">
              <span className="text-xl">◆</span>
              CREATE ROOM
            </h2>

            <div>
              <label className="block text-[#4caf50]/70 text-xs mb-2 uppercase tracking-wider">AGENT CODENAME</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter codename..."
                className="w-full bg-[#0a0a0a] text-[#4caf50] px-4 py-3 rounded border-2 border-[#4caf50]/50 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_20px_rgba(76,175,80,0.3)] placeholder-[#4caf50]/30 font-mono transition-all"
                maxLength={20}
              />
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full py-4 bg-[#4caf50] hover:bg-[#66bb6a] text-[#0a0a0a] uppercase tracking-wider font-bold rounded transition-all shadow-[0_0_30px_rgba(76,175,80,0.5)] hover:shadow-[0_0_40px_rgba(76,175,80,0.6)] hover:scale-[1.02] active:scale-[0.98]"
            >
              INITIALIZE ROOM
            </button>

            <p className="text-[#4caf50]/60 text-xs text-center uppercase tracking-wider">
              Room code will be generated automatically
            </p>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <button onClick={() => setMode('select')} className="text-[#4caf50]/70 hover:text-[#4caf50] text-sm flex items-center gap-2 uppercase tracking-wider transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK
            </button>

            <h2 className="text-2xl font-bold text-[#4caf50] uppercase tracking-widest flex items-center gap-3">
              <span className="text-xl">▶</span>
              JOIN ROOM
            </h2>

            <div>
              <label className="block text-[#4caf50]/70 text-xs mb-2 uppercase tracking-wider">AGENT CODENAME</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter codename..."
                className="w-full bg-[#0a0a0a] text-[#4caf50] px-4 py-3 rounded border-2 border-[#4caf50]/50 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_20px_rgba(76,175,80,0.3)] placeholder-[#4caf50]/30 font-mono transition-all"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-[#4caf50]/70 text-xs mb-2 uppercase tracking-wider">ACCESS CODE</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                className="w-full bg-[#0a0a0a] text-[#4caf50] px-4 py-3 rounded border-2 border-[#4caf50]/50 focus:border-[#4caf50] focus:outline-none focus:shadow-[0_0_20px_rgba(76,175,80,0.3)] text-center text-2xl tracking-[0.5em] font-mono placeholder-[#4caf50]/30 transition-all"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full py-4 bg-[#4caf50] hover:bg-[#66bb6a] text-[#0a0a0a] uppercase tracking-wider font-bold rounded transition-all shadow-[0_0_30px_rgba(76,175,80,0.5)] hover:shadow-[0_0_40px_rgba(76,175,80,0.6)] hover:scale-[1.02] active:scale-[0.98]"
            >
              CONNECT
            </button>
          </div>
        )}

        {/* Bottom status bar */}
        <div className="mt-6 pt-4 border-t border-[#4caf50]/30 flex justify-between items-center text-xs text-[#4caf50]/50">
          <span>v1.0.0</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#4caf50] rounded-full animate-pulse" />
            SECURE
          </span>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes radar-sweep {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes blip {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
        }
        @keyframes title-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(76, 175, 80, 0.5), 0 0 40px rgba(76, 175, 80, 0.3), 0 0 60px rgba(76, 175, 80, 0.1);
          }
          50% {
            text-shadow: 0 0 30px rgba(76, 175, 80, 0.8), 0 0 60px rgba(76, 175, 80, 0.5), 0 0 90px rgba(76, 175, 80, 0.3);
          }
        }
        .animate-radar-sweep {
          animation: radar-sweep 4s linear infinite;
        }
        .animate-blip {
          animation: blip 4s ease-out forwards;
        }
        .animate-title-glow {
          animation: title-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Bug Report Modal */}
      {showBugReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowBugReport(false)}>
          <div
            className="bg-[#0a0a0a] border-2 border-[#f44336] rounded-xl p-6 max-w-md mx-4 shadow-[0_0_60px_rgba(244,67,54,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#f44336] uppercase tracking-widest mb-4 text-center">Report a Bug</h3>
            <p className="text-gray-400 text-sm mb-4 text-center">Send your bug report to:</p>

            <div className="bg-[#1a1a1a] border border-[#4caf50]/50 rounded-lg p-4 mb-4 flex items-center justify-between gap-3">
              <span className="text-[#4caf50] font-mono text-lg select-all">theplotarmour@gmail.com</span>
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
                className={`px-4 py-2 rounded font-bold uppercase text-sm transition-all ${emailCopied
                    ? 'bg-[#4caf50] text-black'
                    : 'bg-[#4caf50]/20 text-[#4caf50] hover:bg-[#4caf50]/40'
                  }`}
              >
                {emailCopied ? '✓ COPIED!' : 'COPY'}
              </button>
            </div>

            <button
              onClick={() => setShowBugReport(false)}
              className="w-full py-3 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 rounded uppercase tracking-wider font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
