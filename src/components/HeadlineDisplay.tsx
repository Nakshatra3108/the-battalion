'use client';

import React, { useEffect, useState } from 'react';
import { HeadlineCard } from '@/types/game';

interface HeadlineDisplayProps {
  headline: HeadlineCard | null;
  onDismiss?: () => void;
}

export default function HeadlineDisplay({ headline, onDismiss }: HeadlineDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (headline) {
      setIsVisible(true);
      // Auto-dismiss after 5 seconds if no dismiss callback
      if (!onDismiss) {
        const timer = setTimeout(() => setIsVisible(false), 5000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [headline, onDismiss]);

  if (!isVisible || !headline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
      <div className="bg-gray-900 border-2 border-yellow-500 rounded-xl p-6 max-w-md mx-4 shadow-2xl transform animate-bounce-in">
        {/* Flashpoint Header */}
        <div className="text-center border-b-2 border-yellow-500 pb-3 mb-4">
          <div className="flex items-center justify-center gap-2 text-yellow-500 text-xs mb-1">
            <span>⚠️ FLASHPOINT ⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">
            {headline.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-center mb-4 italic">
          "{headline.description}"
        </p>

        {/* Effect Badge */}
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 text-center mb-4">
          <span className="text-yellow-400 text-sm font-medium">
            Effect: {getEffectDescription(headline)}
          </span>
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

import { resourceNames, commanderNames } from '@/data/displayNames';

function getEffectDescription(headline: HeadlineCard): string {
  const { effect } = headline;

  switch (effect.type) {
    case 'GLOBAL_RESOURCE_MOD':
      const target = effect.targetType === 'all' ? 'All commanders' :
        effect.targetType === 'active' ? 'Active commander' : 'Other commanders';
      const change = effect.value && effect.value > 0 ? `+${effect.value}` : effect.value;
      const resName = effect.resource ? resourceNames[effect.resource] : 'Resources';
      return `${target} ${change} ${resName}`;

    case 'PLAYER_RESOURCE_MOD':
      const mod = effect.value && effect.value > 0 ? `+${effect.value}` : effect.value;
      const rName = effect.resource ? resourceNames[effect.resource] : 'Resources';
      return `Active commander ${mod} ${rName}`;

    case 'IDEOLOGY_BONUS':
      const iResName = effect.resource ? resourceNames[effect.resource] : 'Resources';
      const rawName = (effect.ideology && commanderNames[effect.ideology]) || effect.ideology || '';
      const displayName = rawName.replace(/^The\s+/, '');
      return `+${effect.value} ${iResName} per ${displayName} card`;

    case 'MAJORITY_BONUS':
      if (effect.targetType === 'majority_holders') {
        return `Commanders with Control gain ${effect.value} Supply`;
      }
      return `Commanders without Control gain ${effect.value} Supply`;

    case 'VOTER_EFFECT':
      if (effect.battalionEffect === 'REMOVE_RANDOM') {
        return 'A random Battalion is removed from the map';
      }
      if (effect.battalionEffect === 'ADD_FREE_BATTALION') {
        return 'Active Commander gains 1 free Battalion';
      }
      return 'Battalion effect applied';

    case 'MARKET_EFFECT':
      return 'Battalion market is reshuffled';

    case 'ZONE_EFFECT':
      return 'Sector effect applied';

    default:
      return headline.description;
  }
}

// Add CSS animation styles
const styles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-bounce-in {
  animation: bounce-in 0.4s ease-out;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
