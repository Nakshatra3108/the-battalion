'use client';

import React, { useState } from 'react';
import { PLAYER_COLORS } from '@/types/game';
import { gameTitle, gameSubtitle } from '@/data/displayNames';

interface SetupScreenProps {
  onStart: (playerNames: string[], playerColors: string[]) => void;
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Operative 1', 'Operative 2', 'Operative 3', 'Operative 4', 'Operative 5']);
  const [shuffledColors, setShuffledColors] = useState<string[]>([]);

  React.useEffect(() => {
    // Shuffle colors once on mount
    const colors = [...PLAYER_COLORS];
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    setShuffledColors(colors);
  }, []);

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const names = playerNames.slice(0, playerCount).map(
      (name, i) => name.trim() || `Operative ${i + 1}`
    );
    // Pass the specific colors assigned to these players
    const colors = shuffledColors.slice(0, playerCount);
    onStart(names, colors);
  };

  if (shuffledColors.length === 0) return null; // Wait for hydration

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(76, 175, 80, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(76, 175, 80, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(20deg)',
          }}
        />
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4caf50]/50 to-transparent shadow-[0_0_20px_#4caf50]" />
      </div>

      <div className="bg-[#0a0a0a] border-2 border-[#4caf50] rounded-lg p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(76,175,80,0.15)] z-10">
        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#4caf50]" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#4caf50]" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#4caf50]" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#4caf50]" />

        {/* Logo/Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#4caf50] mb-2 uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(76,175,80,0.8)]">
            {gameTitle}
          </h1>
          <p className="text-[#4caf50]/50 uppercase tracking-widest text-xs border-y border-[#4caf50]/20 py-1 inline-block px-4">
            {gameSubtitle}
          </p>
        </div>

        {/* Player Count */}
        <div className="mb-8">
          <label className="block text-[#4caf50] text-sm mb-3 uppercase tracking-wider font-bold">
            <span className="mr-2">▶</span> Operation Scale
          </label>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map(count => (
              <button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`
                  flex-1 py-3 rounded font-bold transition-all relative overflow-hidden group
                  ${playerCount === count
                    ? 'bg-[#4caf50] text-[#0a0a0a] shadow-[0_0_15px_#4caf50]'
                    : 'bg-[#0a0a0a] border border-[#4caf50]/30 text-[#4caf50]/50 hover:border-[#4caf50] hover:text-[#4caf50]'
                  }
                `}
              >
                <span className="relative z-10">{count}</span>
                {playerCount !== count && (
                  <div className="absolute inset-0 bg-[#4caf50]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Player Names */}
        <div className="mb-10 space-y-3">
          <label className="block text-[#4caf50] text-sm mb-3 uppercase tracking-wider font-bold">
            <span className="mr-2">▶</span> Operative Identities
          </label>
          {Array.from({ length: playerCount }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0 transition-all group-hover:scale-125"
                style={{
                  backgroundColor: shuffledColors[index],
                  boxShadow: `0 0 10px ${shuffledColors[index]}`
                }}
              />
              <input
                type="text"
                value={playerNames[index]}
                onChange={e => handleNameChange(index, e.target.value)}
                placeholder={`OPERATIVE ${index + 1}`}
                className="
                  flex-1 bg-[#0a0a0a] text-[#4caf50] px-4 py-2.5 rounded
                  border border-[#4caf50]/30 focus:border-[#4caf50] focus:shadow-[0_0_10px_rgba(76,175,80,0.2)]
                  focus:outline-none transition-all placeholder-[#4caf50]/20 font-mono uppercase text-sm
                "
              />
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="
            w-full py-4 bg-[#f44336] hover:bg-[#d32f2f]
            text-[#0a0a0a] text-lg font-bold uppercase tracking-[0.2em]
            rounded transition-all shadow-[0_0_20px_rgba(244,67,54,0.4)]
            hover:shadow-[0_0_30px_rgba(244,67,54,0.6)]
            relative overflow-hidden group
          "
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            INITIATE OPERATION <span className="text-xl">►</span>
          </span>
        </button>

        {/* Instructions */}
        <div className="mt-8 text-center border-t border-[#4caf50]/20 pt-4">
          <p className="text-[#4caf50]/40 text-[10px] uppercase tracking-wider">
            Secure sector majority to establish control
          </p>
        </div>
      </div>
    </div>
  );
}
