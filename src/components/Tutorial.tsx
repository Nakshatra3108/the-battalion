'use client';

import React, { useState } from 'react';
import { RESOURCE_COLORS, IDEOLOGY_COLORS } from '@/types/game';
import { resourceNames, commanderNames, terminology } from '@/data/displayNames';

interface TutorialProps {
  onClose: () => void;
}

const tutorialSections = [
  {
    title: 'MISSION BRIEFING',
    icon: '⚔️',
    content: `
THE BATTALION is a tactical simulation where you compete for regional dominance by securing Sectors on the map.

**OBJECTIVE:** Be the commander with the most CONTROL BATTALIONS when the operation ends.

**The Operation Ends When:**
- All 9 Sectors have a controlling commander, OR
- All grid coordinates are occupied

**CRITICAL INTEL:** You don't win by controlling the most Sectors - you win by having the most Battalions that COUNT toward control!
    `,
  },
  {
    title: 'THE BATTLEFIELD',
    icon: '🗺️',
    content: `
The map contains **9 Sectors** in a 3x3 grid:

| Sector | Capacity | Control Needed |
|--------|----------|----------------|
| Frozen Reach | 11 units | 6 battalions |
| Northern Citadel | 21 units | 11 battalions |
| Storm Peak | 11 units | 6 battalions |
| Iron Gate | 17 units | 9 battalions |
| The Nexus | 9 units | 5 battalions |
| Shadow Pass | 17 units | 9 battalions |
| Dead Drop | 11 units | 6 battalions |
| Southern Bastion | 21 units | 11 battalions |
| Ember Coast | 11 units | 6 battalions |

**Establish Control:** You need MORE THAN HALF of a Sector's capacity. Once controlled, those Battalions are LOCKED and score points.
    `,
  },
  {
    title: 'HOT ZONES',
    icon: '⚡',
    content: `
Each Sector has **Hot Zones** (marked with ⚡) - 11 total across the map.

**Occupying a Hot Zone:**
- Triggers a **Flashpoint Event** immediately
- The Battalion becomes **PERMANENT** and cannot be:
  - Redeployed (moved)
  - Converted by enemy agents
  - Destroyed by most weapons

Hot Zones are strategic choke points - they trigger volatility but offer permanent footholds!
    `,
  },
  {
    title: 'RESOURCES',
    icon: '💎',
    content: `
Manage **4 resource types** (max 12 total):

🟡 **${resourceNames.funds.toUpperCase()}** - Logistics & Economics
🔴 **${resourceNames.clout.toUpperCase()}** - Force Projection
🟣 **${resourceNames.media.toUpperCase()}** - Intel Operations
🔵 **${resourceNames.trust.toUpperCase()}** - Psychological Ops

**Prioritized Supply:** Start resources are assigned by turn order to balance initiative (P1: 6, P2: 7, P3: 8...).

Use resources to:
- Requisition Battalions
- Acquire Black Ops assets
- Activate Commander Powers
- Request new Situation Reports (Cost: 4)
    `,
  },
  {
    title: 'COMMANDERS (IDEOLOGIES)',
    icon: '🎖️',
    content: `
Four Command Doctrines drive the conflict:

🟡 **${commanderNames.capitalist.toUpperCase()}** → ${resourceNames.funds}
- Focus: Economic dominance and resource extraction

🔴 **${commanderNames.supremo.toUpperCase()}** → ${resourceNames.clout}
- Focus: Direct force, destruction, and territory seizure

🟣 **${commanderNames.showstopper.toUpperCase()}** → ${resourceNames.media}
- Focus: Rapid deployment and force multiplication

🔵 **${commanderNames.idealist.toUpperCase()}** → ${resourceNames.trust}
- Focus: Conversion and cost reduction

Answering a **Situation Report** grants progress on that Command Track.
    `,
  },
  {
    title: 'OPERATION SEQUENCE',
    icon: '🔄',
    content: `
Each turn follows this protocol:

**1. EVICTED UNIT REDEPLOYMENT**
- If Battalions were evicted by Supply Blockade, redeploy them immediately.

**2. SITUATION REPORT ANALYSIS**
- Receive a tactical situation report.
- Choose a course of action.
- Gain resources + Command Track progress.
- Optional: Pay 4 resources to request different intel.

**3. ACTION PHASE**
- Requisition Battalions.
- Acquire Black Ops cards.
- Activate Commander Powers.
- Deploy Black Ops assets.

**4. DEPLOYMENT**
- Deploy Battalions from reserve to the field.

**5. REDEPLOYMENT**
- Maneuver forces between controlled sectors.
    `,
  },
  {
    title: 'REDEPLOYMENT',
    icon: '↔️',
    content: `
Tactical movement of forces between adjacent Sectors.

**Movement Rights:**
- You must have the **MOST Battalions** in a Sector.
- Ties = No movement rights.

**Rules of Engagement:**
- Move **ANY commander's** Battalions (not just your own).
- Only to **adjacent Sectors**.
- Cannot move from **Hot Zones**.
- Cannot move **Control Battalions** (Locked).
- Cannot abandon a Sector completely using its own rights.
    `,
  },
  {
    title: 'COMMANDER POWERS (L2)',
    icon: '⭐',
    content: `
**Level 2: PASSIVE BONUSES** (Always Active)

Unlock at **2 Situation Reports** of a specific doctrine:

🟡 **Investment Returns** (${commanderNames.capitalist}): +1 ${resourceNames.funds} every 2 answers
🔴 **Intimidation** (${commanderNames.supremo}): +1 ${resourceNames.clout} every 2 answers
🟣 **Media Presence** (${commanderNames.showstopper}): +1 ${resourceNames.media} every 2 answers
🔵 **Grassroots Support** (${commanderNames.idealist}): +1 ${resourceNames.trust} every 2 answers

Bonuses **STACK**! Focus on one doctrine for massive resource generation.
    `,
  },
  {
    title: 'COMMANDER POWERS (L3)',
    icon: '⭐⭐',
    content: `
**Level 3: ACTIVE ABILITIES**

Unlock at **3 Situation Reports**:

🟡 **Prospecting** (${commanderNames.capitalist})
- Trade 1 resource → Get 2 resources.

🔴 **Donations** (${commanderNames.supremo})
- Seize 1 resource from any opponent.

🟣 **Going Viral** (${commanderNames.showstopper})
- Get +1 bonus Battalion when requisitioning.

🔵 **Helping Hands** (${commanderNames.idealist})
- Get 1 resource discount on any purchase.
    `,
  },
  {
    title: 'COMMANDER POWERS (L5)',
    icon: '⭐⭐⭐',
    content: `
**Level 5: ULTIMATE CAPABILITIES**

Unlock at **5 Situation Reports**:

🟡 **Supply Blockade** (${commanderNames.capitalist})
- **EVICT** any Battalion from the board. Occupier must redeploy next turn.

🔴 **Kinetic Strike** (${commanderNames.supremo})
- Pay 1 resource → **DESTROY** an enemy Battalion permanently.

🟣 **Election Fever** (${commanderNames.showstopper})
- Passive: Redeploy 2 Battalions per Sector instead of 1.

🔵 **Tough Love** (${commanderNames.idealist})
- Pay 2 Trust + 2 Any → **CONVERT** 2 enemy Battalions to your side.
    `,
  },
  {
    title: 'DEPLOYMENT ORDERS',
    icon: '📝',
    content: `
The **Unit Requisition** shows 4 options.

**Requisitioning Costs:**
| Battalions | Typical Cost |
|------------|--------------|
| 1 Unit | 2 resources |
| 2 Units | 4 resources |
| 3 Units | 6 resources |

**Tactical Tips:**
- Units go to **Reserve** first.
- Deploy them in Phase 4.
- Use **Going Viral** for free units.
    `,
  },
  {
    title: 'BLACK OPS',
    icon: '🕵️',
    content: `
Black Ops are covert actions for turning the tide.

**Notable Operations:**
| Op Name | Cost | Effect |
|---------|------|--------|
| Political Veto | 4 | Block redeployment |
| Safe Zone | 4 | Protect Sector |
| Bribery | 4 | Steal 2 resources |
| Scandal | 4 | Enemy resource drain |
| Coup | 5 | Destroy enemy Battalion |
| Defection | 4 | Force move enemy |
| Political Shuffle | 4 | Swap 2 Battalions |
| Fake News | 4 | Cancel Flashpoint |
| Emergency Session | 5 | Extra Action Phase |
    `,
  },
  {
    title: 'VICTORY CONDITIONS',
    icon: '🏆',
    content: `
**Mission Complete When:**
1. All 9 Sectors are Controlled, OR
2. Map is fully saturated

**Debriefing & Scoring:**
- Count your **CONTROL BATTALIONS** (those securing a Sector).
- 1 Locked Battalion = 1 Point.
- Highest score wins.

**Strategy:**
- Secure large Sectors (North/South) for points.
- Secure corners for easy footholds.
- Deny enemies via Hot Zones.
    `,
  },
];

export default function Tutorial({ onClose }: TutorialProps) {
  const [currentSection, setCurrentSection] = useState(0);

  const section = tutorialSections[currentSection];

  const goNext = () => {
    if (currentSection < tutorialSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border-2 border-[#4caf50] rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(76,175,80,0.2)] font-mono relative overflow-hidden">

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#4caf50]/30 bg-[#0a0a0a] relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(76,175,80,0.5)]">{section.icon}</span>
            <h2 className="text-xl font-bold text-[#4caf50] uppercase tracking-widest text-shadow-[0_0_10px_rgba(76,175,80,0.5)]">
              {section.title}
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
        <div className="px-4 py-3 border-b border-[#4caf50]/10 bg-[#0a0a0a] relative z-10">
          <div className="flex gap-1 h-1.5">
            {tutorialSections.map((_, index) => (
              <div
                key={index}
                className={`flex-1 rounded-full transition-all duration-300 ${index === currentSection
                  ? 'bg-[#4caf50] shadow-[0_0_10px_#4caf50]'
                  : index < currentSection
                    ? 'bg-[#4caf50]/40'
                    : 'bg-[#4caf50]/10'
                  }`}
              />
            ))}
          </div>
          <p className="text-right text-[#4caf50]/40 text-[10px] mt-1 uppercase tracking-wider">
            SEQ {currentSection + 1} / {tutorialSections.length}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative z-10 scrollbar-thin scrollbar-thumb-[#4caf50]/20 scrollbar-track-transparent">
          <div className="prose prose-invert max-w-none">
            {section.content.split('\n').map((line, i) => {
              // Handle headers
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <h3 key={i} className="text-lg font-bold text-[#f44336] mt-4 mb-2 uppercase tracking-wide border-b border-[#f44336]/20 pb-1 w-fit">
                    {line.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              // Handle tables
              if (line.startsWith('|')) {
                const cells = line.split('|').filter(c => c.trim());
                if (cells.every(c => c.trim().match(/^[-]+$/))) {
                  return null; // Skip separator
                }
                const isHeader = line.includes('---') === false &&
                  tutorialSections[currentSection].content.split('\n').indexOf(line) <
                  tutorialSections[currentSection].content.split('\n').findIndex(l => l.indexOf('---') > -1) + 2;

                // Better header detection: usually first row of table block
                const isFirstRow = section.content.split('\n')[i - 1]?.trim() === '' || !section.content.split('\n')[i - 1]?.startsWith('|');

                return (
                  <div key={i} className={`grid grid-cols-${cells.length} gap-2 ${isFirstRow ? 'bg-[#4caf50]/10 border-y border-[#4caf50]/30 font-bold text-[#4caf50]' : 'border-b border-[#4caf50]/10 hover:bg-[#4caf50]/5'} py-1.5 px-2 transition-colors`}>
                    {cells.map((cell, j) => (
                      <span key={j} className={`text-xs ${isFirstRow ? 'text-[#4caf50]' : 'text-[#4caf50]/80'}`}>
                        {cell.trim()}
                      </span>
                    ))}
                  </div>
                );
              }

              // Handle lists
              if (line.trim().startsWith('-')) {
                return (
                  <div key={i} className="flex gap-2 mb-1.5 ml-4 text-sm">
                    <span className="text-[#4caf50] mt-0.5">▶</span>
                    <span className="text-[#e0e0e0]/90">{line.trim().substring(1).trim()}</span>
                  </div>
                );
              }

              const parts = line.split(/(\*\*[^*]+\*\*)/g);
              if (line.trim()) {
                return (
                  <p key={i} className="text-[#e0e0e0]/80 mb-3 text-sm leading-relaxed">
                    {parts.map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong key={j} className="text-[#4caf50] font-bold">
                            {part.replace(/\*\*/g, '')}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-[#4caf50]/30 bg-[#0a0a0a] relative z-10">
          <button
            onClick={goPrev}
            disabled={currentSection === 0}
            className={`px-4 py-2 rounded font-bold uppercase tracking-wider text-xs transition-all ${currentSection === 0
              ? 'text-[#4caf50]/20 cursor-not-allowed border border-[#4caf50]/10'
              : 'text-[#4caf50] border border-[#4caf50]/50 hover:bg-[#4caf50]/10 hover:shadow-[0_0_10px_rgba(76,175,80,0.2)]'
              }`}
          >
            ← PREV
          </button>

          {/* Quick Nav Dots */}
          <div className="hidden md:flex gap-1.5 flex-wrap justify-center sm:max-w-[50%]">
            {tutorialSections.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentSection(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSection
                  ? 'bg-[#4caf50] shadow-[0_0_5px_#4caf50] scale-125'
                  : 'bg-[#4caf50]/20 hover:bg-[#4caf50]/50'
                  }`}
                title={s.title}
              />
            ))}
          </div>

          {currentSection === tutorialSections.length - 1 ? (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#f44336] text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-[#d32f2f] transition-all shadow-[0_0_15px_rgba(244,67,54,0.4)] animate-pulse"
            >
              INITIATE
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
