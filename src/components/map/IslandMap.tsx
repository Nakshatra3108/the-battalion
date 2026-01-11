'use client';

import React from 'react';
import { GameState } from '@/types/game';
import { calculateZoneMajority } from '@/lib/gameEngine';
import ZoneComponent from '../Zone';

interface IslandMapProps {
  state: GameState;
  onSlotClick: (zoneId: string, slotIndex: number) => void;
  selectedSlot: { zoneId: string; slotIndex: number } | null;
  highlightedZones?: string[];
}

const SECTOR_GRID = [
  ['zone_1', 'zone_6', 'zone_2'],
  ['zone_0', 'zone_8', 'zone_3'],
  ['zone_4', 'zone_7', 'zone_5'],
];

export default function IslandMap({
  state,
  onSlotClick,
  selectedSlot,
  highlightedZones = [],
}: IslandMapProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0a0a]">
      {/* Grid Background Pattern - More visible */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(76, 175, 80, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76, 175, 80, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* 9 Sector Grid */}
      <div className="absolute inset-2 grid grid-cols-3 grid-rows-3 gap-1">
        {SECTOR_GRID.flat().map((zoneId, index) => {
          const zone = state.zones[zoneId];
          if (!zone) return <div key={index} />;

          const majority = calculateZoneMajority(zone, state.players);
          const majorityPlayer = majority.majorityOwner
            ? state.players[majority.majorityOwner]
            : null;
          const isProtected = state.protectedZones?.includes(zone.id) || false;
          const isHighlighted = highlightedZones.includes(zone.id);

          return (
            <div
              key={zone.id}
              className={`
                relative flex flex-col rounded overflow-hidden
                transition-all duration-200 font-mono
                ${isHighlighted ? 'z-20' : 'z-10'}
              `}
              style={{
                background: 'rgba(10, 10, 10, 0.9)',
                border: `2px solid ${isHighlighted ? '#4caf50' : 'rgba(76, 175, 80, 0.5)'}`,
                boxShadow: isHighlighted
                  ? '0 0 25px rgba(76, 175, 80, 0.5), inset 0 0 20px rgba(76, 175, 80, 0.1)'
                  : '0 0 10px rgba(76, 175, 80, 0.15), inset 0 0 15px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Sector Header - More visible */}
              <div className="px-2 py-1 flex items-center justify-between border-b-2 border-[#4caf50]/40 bg-black/60">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-[#4caf50] uppercase tracking-wider font-bold" style={{ textShadow: '0 0 8px rgba(76, 175, 80, 0.8)' }}>
                    {zone.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#4caf50]/70 font-mono">
                    [{zone.majorityRequired}/{zone.capacity}]
                  </span>
                </div>
                {isProtected && (
                  <span className="text-[#f44336] text-xs">●</span>
                )}
              </div>

              {/* Zone Content */}
              <div className="flex-1 relative flex items-center justify-center p-1">
                <ZoneComponent
                  zone={zone}
                  players={state.players}
                  majorityPlayer={majorityPlayer}
                  isTied={majority.isTied}
                  onSlotClick={slotIndex => onSlotClick(zone.id, slotIndex)}
                  selectedSlot={
                    selectedSlot?.zoneId === zone.id ? selectedSlot.slotIndex : null
                  }
                  isHighlighted={isHighlighted}
                  isProtected={isProtected}
                />
              </div>

              {/* Majority Indicator */}
              {majorityPlayer && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
                  <div
                    className="px-3 py-1 rounded text-[10px] sm:text-xs font-bold uppercase"
                    style={{
                      backgroundColor: majorityPlayer.color,
                      color: '#0a0a0a',
                      boxShadow: `0 0 15px ${majorityPlayer.color}`
                    }}
                  >
                    {majorityPlayer.name}
                  </div>
                </div>
              )}
              {majority.isTied && !majorityPlayer && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-3 py-1 rounded text-[10px] font-bold uppercase bg-[#f44336] text-black" style={{ boxShadow: '0 0 15px #f44336' }}>
                    CONTESTED
                  </div>
                </div>
              )}

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#4caf50]/60" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#4caf50]/60" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#4caf50]/60" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#4caf50]/60" />
            </div>
          );
        })}
      </div>

      {/* Outer Corner Brackets */}
      <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-[#4caf50] pointer-events-none" />
      <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#4caf50] pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[#4caf50] pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[#4caf50] pointer-events-none" />
    </div>
  );
}
