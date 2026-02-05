'use client';

import React from 'react';

interface PhaseTimerProps {
  timeRemaining: number; // in seconds
  totalTime: number; // total duration in seconds
  phaseName: string;
}

export default function PhaseTimer({ timeRemaining, totalTime, phaseName }: PhaseTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = (timeRemaining / totalTime) * 100;
  const isWarning = timeRemaining <= 30;
  const isCritical = timeRemaining <= 10;

  return (
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-lg font-mono
      ${isCritical 
        ? 'bg-[#f44336]/30 border border-[#f44336] animate-pulse' 
        : isWarning 
          ? 'bg-[#ff9800]/20 border border-[#ff9800]' 
          : 'bg-[#0a0a0a] border border-[#4caf50]/50'
      }
    `}>
      {/* Timer Icon */}
      <div className={`
        text-lg
        ${isCritical ? 'text-[#f44336]' : isWarning ? 'text-[#ff9800]' : 'text-[#4caf50]'}
      `}>
        ⏱
      </div>

      {/* Progress Bar */}
      <div className="w-24 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className={`
            h-full transition-all duration-1000 ease-linear rounded-full
            ${isCritical 
              ? 'bg-[#f44336] shadow-[0_0_8px_#f44336]' 
              : isWarning 
                ? 'bg-[#ff9800] shadow-[0_0_8px_#ff9800]' 
                : 'bg-[#4caf50] shadow-[0_0_8px_#4caf50]'
            }
          `}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Display */}
      <div className={`
        text-lg font-bold tabular-nums min-w-[60px] text-center
        ${isCritical 
          ? 'text-[#f44336]' 
          : isWarning 
            ? 'text-[#ff9800]' 
            : 'text-[#4caf50]'
        }
      `}
        style={{ 
          textShadow: isCritical 
            ? '0 0 10px rgba(244,67,54,0.8)' 
            : isWarning 
              ? '0 0 10px rgba(255,152,0,0.8)' 
              : '0 0 10px rgba(76,175,80,0.5)' 
        }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {/* Phase Label */}
      <div className={`
        text-xs uppercase tracking-wider hidden sm:block
        ${isCritical ? 'text-[#f44336]/80' : isWarning ? 'text-[#ff9800]/80' : 'text-[#4caf50]/60'}
      `}>
        {phaseName}
      </div>
    </div>
  );
}
