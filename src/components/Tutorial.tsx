'use client';

import React, { useState } from 'react';

interface TutorialProps {
  onClose: () => void;
}

// Tutorial slides - self-contained content
const SLIDES = [
  {
    id: 'objective',
    title: 'MISSION OBJECTIVE',
    icon: '🎯',
    content: (
      <div className="space-y-4">
        <div className="bg-[#4caf50]/10 border border-[#4caf50]/40 rounded-lg p-4">
          <p className="text-[#4caf50] font-bold text-lg uppercase tracking-wider mb-2">Goal: Lock the Most Battalions</p>
          <p className="text-gray-300 text-sm">Unlike typical territory games, you win by <span className="text-[#4caf50] font-bold">LOCKING</span> your troops in place, not just occupying land.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/40 border border-[#4caf50]/30 rounded-lg p-3 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-[#4caf50] text-xs uppercase tracking-wider">1 Locked Battalion</p>
            <p className="text-white font-bold text-lg">= 1 Point</p>
          </div>
          <div className="bg-black/40 border border-[#f44336]/30 rounded-lg p-3 text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <p className="text-[#f44336] text-xs uppercase tracking-wider">Game Ends When</p>
            <p className="text-white font-bold text-sm">All 9 sectors controlled<br />OR map is full</p>
          </div>
        </div>

        <div className="bg-[#ff9800]/10 border border-[#ff9800]/40 rounded-lg p-3">
          <p className="text-[#ff9800] text-sm">
            <span className="font-bold">🔐 HOW TO LOCK:</span> Deploy enough troops to secure a sector (&gt;50% capacity). Your units become permanent statues!
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'map',
    title: 'THE BATTLEFIELD',
    icon: '🗺️',
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 text-sm text-center">The map is a 3x3 grid with 9 sectors of different sizes</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-[#4caf50]/10 border border-[#4caf50]/40 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏔️</span>
              <span className="text-[#4caf50] font-bold uppercase">Corners ×4</span>
            </div>
            <p className="text-gray-400 text-xs">11 slots • Need 6 to control</p>
            <p className="text-white font-bold">+6 Points</p>
          </div>

          <div className="bg-[#03a9f4]/10 border border-[#03a9f4]/40 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌉</span>
              <span className="text-[#03a9f4] font-bold uppercase">Edges ×2</span>
            </div>
            <p className="text-gray-400 text-xs">17 slots • Need 9 to control</p>
            <p className="text-white font-bold">+9 Points</p>
          </div>

          <div className="bg-[#9c27b0]/10 border border-[#9c27b0]/40 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⭐</span>
              <span className="text-[#9c27b0] font-bold uppercase">Center ×1</span>
            </div>
            <p className="text-gray-400 text-xs">9 slots • Need 5 to control</p>
            <p className="text-white font-bold">+5 Points</p>
          </div>

          <div className="bg-[#f44336]/10 border border-[#f44336]/40 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏰</span>
              <span className="text-[#f44336] font-bold uppercase">Citadels ×2</span>
            </div>
            <p className="text-gray-400 text-xs">21 slots • Need 11 to control</p>
            <p className="text-white font-bold">+11 Points</p>
          </div>
        </div>

        <div className="bg-[#f44336]/10 border border-[#f44336]/40 rounded-lg p-3">
          <p className="text-[#f44336] text-sm">
            <span className="font-bold">⚡ HOT ZONES:</span> Some slots trigger random events. Units here become PERMANENT and cannot move!
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'resources',
    title: 'RESOURCES',
    icon: '💰',
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 text-sm text-center">You have 4 types of currency. Maximum 12 total resources!</p>

        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-[#4caf50]/10 border border-[#4caf50]/30 rounded-lg p-3">
            <span className="text-2xl">🟢</span>
            <div>
              <p className="text-[#4caf50] font-bold uppercase tracking-wider">Supply</p>
              <p className="text-gray-400 text-xs">Used for purchasing units (Economy)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#f44336]/10 border border-[#f44336]/30 rounded-lg p-3">
            <span className="text-2xl">🔴</span>
            <div>
              <p className="text-[#f44336] font-bold uppercase tracking-wider">Firepower</p>
              <p className="text-gray-400 text-xs">Used for attacking enemies (Force)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#5AB4FF]/10 border border-[#5AB4FF]/30 rounded-lg p-3">
            <span className="text-2xl">🔵</span>
            <div>
              <p className="text-[#5AB4FF] font-bold uppercase tracking-wider">Intel</p>
              <p className="text-gray-400 text-xs">Used for spying and information</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#FFC734]/10 border border-[#FFC734]/30 rounded-lg p-3">
            <span className="text-2xl">🟡</span>
            <div>
              <p className="text-[#FFC734] font-bold uppercase tracking-wider">Morale</p>
              <p className="text-gray-400 text-xs">Used for defense and conversion (Loyalty)</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'turn',
    title: 'YOUR TURN',
    icon: '📋',
    content: (
      <div className="space-y-3">
        <p className="text-gray-300 text-sm text-center">Each turn has 4 phases in order</p>

        <div className="space-y-2">
          <div className="flex items-start gap-3 bg-[#4caf50]/10 border border-[#4caf50]/30 rounded-lg p-3">
            <span className="bg-[#4caf50] text-black font-bold w-6 h-6 flex items-center justify-center rounded text-sm">1</span>
            <div>
              <p className="text-[#4caf50] font-bold uppercase text-sm">Situation Report</p>
              <p className="text-gray-400 text-xs">Answer a question card to gain resources + level up a commander</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#ff9800]/10 border border-[#ff9800]/30 rounded-lg p-3">
            <span className="bg-[#ff9800] text-black font-bold w-6 h-6 flex items-center justify-center rounded text-sm">2</span>
            <div>
              <p className="text-[#ff9800] font-bold uppercase text-sm">Action Phase</p>
              <p className="text-gray-400 text-xs">Buy battalions, purchase Black Ops cards, use commander powers</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#03a9f4]/10 border border-[#03a9f4]/30 rounded-lg p-3">
            <span className="bg-[#03a9f4] text-black font-bold w-6 h-6 flex items-center justify-center rounded text-sm">3</span>
            <div>
              <p className="text-[#03a9f4] font-bold uppercase text-sm">Deployment</p>
              <p className="text-gray-400 text-xs">Place all purchased battalions on the map in empty slots</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#9c27b0]/10 border border-[#9c27b0]/30 rounded-lg p-3">
            <span className="bg-[#9c27b0] text-black font-bold w-6 h-6 flex items-center justify-center rounded text-sm">4</span>
            <div>
              <p className="text-[#9c27b0] font-bold uppercase text-sm">Redeployment</p>
              <p className="text-gray-400 text-xs">Move unlocked units between adjacent sectors (optional)</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'movement',
    title: 'MOVEMENT RULES',
    icon: '🚀',
    content: (
      <div className="space-y-3">
        <p className="text-gray-300 text-sm text-center">Strict rules govern how units can move</p>

        <div className="space-y-2 text-sm">
          <div className="bg-black/40 border border-[#4caf50]/30 rounded-lg p-3">
            <p className="text-[#4caf50] font-bold mb-1">📌 MAJORITY RULE</p>
            <p className="text-gray-400 text-xs">Can only move OUT of sectors you control (&gt;50%)</p>
          </div>

          <div className="bg-black/40 border border-[#ff9800]/30 rounded-lg p-3">
            <p className="text-[#ff9800] font-bold mb-1">🔓 UNLOCKED RULE</p>
            <p className="text-gray-400 text-xs">Only EXTRA units above control threshold can move. Locked units stay put.</p>
          </div>

          <div className="bg-black/40 border border-[#03a9f4]/30 rounded-lg p-3">
            <p className="text-[#03a9f4] font-bold mb-1">🔗 ADJACENCY RULE</p>
            <p className="text-gray-400 text-xs">Units can only move to connected neighboring sectors</p>
          </div>

          <div className="bg-black/40 border border-[#f44336]/30 rounded-lg p-3">
            <p className="text-[#f44336] font-bold mb-1">⚔️ HOSTILE RULE</p>
            <p className="text-gray-400 text-xs">You can move ANY unlocked unit - even enemy units!</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'commanders',
    title: 'COMMANDERS',
    icon: '⭐',
    content: (
      <div className="space-y-3">
        <p className="text-gray-300 text-sm text-center">Level up 4 commander tracks for powerful abilities</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#4caf50]/10 border border-[#4caf50]/30 rounded-lg p-2">
            <p className="text-[#4caf50] font-bold uppercase">🟢 Contractor</p>
            <p className="text-gray-400">L3: Trade resources</p>
            <p className="text-gray-400">L5: Evict enemy unit</p>
          </div>

          <div className="bg-[#f44336]/10 border border-[#f44336]/30 rounded-lg p-2">
            <p className="text-[#f44336] font-bold uppercase">🔴 Hardliner</p>
            <p className="text-gray-400">L3: Steal resources</p>
            <p className="text-gray-400">L5: Destroy unit</p>
          </div>

          <div className="bg-[#5AB4FF]/10 border border-[#5AB4FF]/30 rounded-lg p-2">
            <p className="text-[#5AB4FF] font-bold uppercase">🔵 Operative</p>
            <p className="text-gray-400">L3: +1 free battalion</p>
            <p className="text-gray-400">L5: Move 2 units/sector</p>
          </div>

          <div className="bg-[#FFC734]/10 border border-[#FFC734]/30 rounded-lg p-2">
            <p className="text-[#FFC734] font-bold uppercase">🟡 Diplomat</p>
            <p className="text-gray-400">L3: Purchase discount</p>
            <p className="text-gray-400">L5: Convert enemies</p>
          </div>
        </div>

        <div className="bg-[#4caf50]/10 border border-[#4caf50]/30 rounded-lg p-2 text-center">
          <p className="text-[#4caf50] text-xs">Level up by answering situation reports with matching colors!</p>
        </div>
      </div>
    ),
  },
  {
    id: 'blackops',
    title: 'BLACK OPS',
    icon: '🎴',
    content: (
      <div className="space-y-3">
        <p className="text-gray-300 text-sm text-center">Secret cards that break the rules (Max 3 in hand)</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-black/40 border border-[#f44336]/30 rounded-lg p-2">
            <p className="text-[#f44336] font-bold">TACTICAL VETO</p>
            <p className="text-gray-400">Block a redeployment</p>
          </div>
          <div className="bg-black/40 border border-[#f44336]/30 rounded-lg p-2">
            <p className="text-[#f44336] font-bold">SURGICAL STRIKE</p>
            <p className="text-gray-400">Destroy an enemy unit</p>
          </div>
          <div className="bg-black/40 border border-[#FFC734]/30 rounded-lg p-2">
            <p className="text-[#FFC734] font-bold">ASSET SEIZURE</p>
            <p className="text-gray-400">Steal 2 resources of a type</p>
          </div>
          <div className="bg-black/40 border border-[#FFC734]/30 rounded-lg p-2">
            <p className="text-[#FFC734] font-bold">SABOTAGE</p>
            <p className="text-gray-400">All enemies lose 1 resource</p>
          </div>
          <div className="bg-black/40 border border-[#5AB4FF]/30 rounded-lg p-2">
            <p className="text-[#5AB4FF] font-bold">FORCE REDEPLOY</p>
            <p className="text-gray-400">Force-move enemy unit</p>
          </div>
          <div className="bg-black/40 border border-[#4caf50]/30 rounded-lg p-2">
            <p className="text-[#4caf50] font-bold">INTEL SWEEP</p>
            <p className="text-gray-400">Gain 4 resources of each</p>
          </div>
        </div>

        <div className="bg-[#f44336]/10 border border-[#f44336]/30 rounded-lg p-2 text-center">
          <p className="text-[#f44336] text-xs">Purchase cards with resources to get tactical advantages!</p>
        </div>
      </div>
    ),
  },
  {
    id: 'tips',
    title: 'QUICK TIPS',
    icon: '💡',
    content: (
      <div className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="bg-[#4caf50]/10 border border-[#4caf50]/30 rounded-lg p-3 flex gap-3">
            <span className="text-xl">🏔️</span>
            <p className="text-gray-300"><span className="text-[#4caf50] font-bold">Rush Corners early.</span> They're easier to lock and give solid points.</p>
          </div>

          <div className="bg-[#ff9800]/10 border border-[#ff9800]/30 rounded-lg p-3 flex gap-3">
            <span className="text-xl">🎯</span>
            <p className="text-gray-300"><span className="text-[#ff9800] font-bold">Don't spread thin.</span> Focus on securing sectors fully before expanding.</p>
          </div>

          <div className="bg-[#f44336]/10 border border-[#f44336]/30 rounded-lg p-3 flex gap-3">
            <span className="text-xl">⚡</span>
            <p className="text-gray-300"><span className="text-[#f44336] font-bold">Hot Zones are traps.</span> Use them strategically - units can't leave!</p>
          </div>

          <div className="bg-[#9c27b0]/10 border border-[#9c27b0]/30 rounded-lg p-3 flex gap-3">
            <span className="text-xl">🎴</span>
            <p className="text-gray-300"><span className="text-[#9c27b0] font-bold">Save Black Ops cards.</span> Use them to disrupt enemy locks.</p>
          </div>

          <div className="bg-[#03a9f4]/10 border border-[#03a9f4]/30 rounded-lg p-3 flex gap-3">
            <span className="text-xl">⭐</span>
            <p className="text-gray-300"><span className="text-[#03a9f4] font-bold">Level up commanders.</span> L5 powers can turn the game around!</p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Tutorial({ onClose }: TutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      goNext();
    } else if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-[#0a0a0a] border-2 border-[#4caf50] rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(76,175,80,0.2)] font-mono relative overflow-hidden">

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#4caf50]/30 bg-black/50 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{slide.icon}</span>
            <h2 className="text-lg font-bold text-[#4caf50] uppercase tracking-widest">
              {slide.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#4caf50]/60 hover:text-[#f44336] text-2xl transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2 border-b border-[#4caf50]/10 bg-black/30 relative z-10">
          <div className="flex gap-1 h-1">
            {SLIDES.map((_, index) => (
              <div
                key={index}
                className={`flex-1 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide
                  ? 'bg-[#4caf50] shadow-[0_0_10px_#4caf50]'
                  : index < currentSlide
                    ? 'bg-[#4caf50]/40'
                    : 'bg-[#4caf50]/10'
                  }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          <p className="text-right text-[#4caf50]/60 text-[10px] mt-1 uppercase tracking-wider">
            {currentSlide + 1} / {SLIDES.length}
          </p>
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-y-auto p-4 relative z-10">
          {slide.content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-[#4caf50]/30 bg-black/50 relative z-10">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className={`px-4 py-2 rounded font-bold uppercase tracking-wider text-xs transition-all ${currentSlide === 0
              ? 'text-[#4caf50]/20 cursor-not-allowed border border-[#4caf50]/10'
              : 'text-[#4caf50] border border-[#4caf50]/50 hover:bg-[#4caf50]/10'
              }`}
          >
            ← PREV
          </button>

          {/* Quick Nav Dots */}
          <div className="hidden sm:flex gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide
                  ? 'bg-[#4caf50] shadow-[0_0_5px_#4caf50] scale-125'
                  : 'bg-[#4caf50]/20 hover:bg-[#4caf50]/50'
                  }`}
                title={s.title}
              />
            ))}
          </div>

          {currentSlide === SLIDES.length - 1 ? (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#f44336] text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-[#d32f2f] transition-all shadow-[0_0_15px_rgba(244,67,54,0.4)] animate-pulse"
            >
              DEPLOY
            </button>
          ) : (
            <button
              onClick={goNext}
              className="px-6 py-2 bg-[#4caf50] text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-[#43a047] transition-all shadow-[0_0_15px_rgba(76,175,80,0.4)]"
            >
              NEXT →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
