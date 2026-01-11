'use client';

import React, { useState } from 'react';
import { GameState, Player, Resources, ResourceType, RESOURCE_COLORS } from '@/types/game';
import { resourceNames } from '@/data/displayNames';

interface FirstPlayerSelectionScreenProps {
  state: GameState;
  currentPlayerId?: string;
  onVote: (voterId: string, voteForId: string) => void;
  onBid: (bidderId: string, bid: Partial<Resources>) => void;
}

const resourceTypes: ResourceType[] = ['funds', 'clout', 'media', 'trust'];

export default function FirstPlayerSelectionScreen({
  state,
  currentPlayerId,
  onVote,
  onBid,
}: FirstPlayerSelectionScreenProps) {
  const players = Object.values(state.players);
  const playerCount = players.length;
  const isVotingMode = playerCount >= 3;
  const isBiddingMode = playerCount === 2;

  const votedPlayerIds = state.firstPlayerSelection?.votes
    ? Object.keys(state.firstPlayerSelection.votes)
    : [];
  const bidPlayerIds = state.firstPlayerSelection?.bids
    ? Object.keys(state.firstPlayerSelection.bids)
    : [];

  const getCurrentPlayer = (): Player | null => {
    if (currentPlayerId && state.players[currentPlayerId]) {
      const hasVoted = isVotingMode && votedPlayerIds.includes(currentPlayerId);
      const hasBid = isBiddingMode && bidPlayerIds.includes(currentPlayerId);
      if (!hasVoted && !hasBid) {
        return state.players[currentPlayerId];
      }
      return null;
    }
    if (isVotingMode) {
      return players.find(p => !votedPlayerIds.includes(p.id)) || null;
    } else {
      return players.find(p => !bidPlayerIds.includes(p.id)) || null;
    }
  };

  const currentPlayer = getCurrentPlayer();

  const [bid, setBid] = useState<Partial<Resources>>({
    funds: 0,
    clout: 0,
    media: 0,
    trust: 0,
  });

  const handleVoteClick = (voteForId: string) => {
    if (!currentPlayer) return;
    onVote(currentPlayer.id, voteForId);
  };

  const handleBidSubmit = () => {
    if (!currentPlayer) return;
    onBid(currentPlayer.id, bid);
    setBid({ funds: 0, clout: 0, media: 0, trust: 0 });
  };

  const bidTotal = (bid.funds || 0) + (bid.clout || 0) + (bid.media || 0) + (bid.trust || 0);

  if (!currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono bg-black">
        <div className="text-center p-8 rounded-lg border-2 border-[#4caf50]" style={{ backgroundColor: '#0a0a0a' }}>
          <h2 className="text-2xl font-bold text-[#4caf50] mb-4 animate-pulse uppercase tracking-widest">
            PROCESSING TACTICAL DATA...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(76, 175, 80, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(76, 175, 80, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-lg w-full rounded-lg p-6 border-2 border-[#4caf50]" style={{ backgroundColor: '#0a0a0a' }}>
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#4caf50]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#4caf50]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#4caf50]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#4caf50]" />

        <h1 className="text-2xl font-bold text-center mb-2 text-[#4caf50] uppercase tracking-widest" style={{ fontFamily: 'var(--font-header)', textShadow: '0 0 15px rgba(76,175,80,0.5)' }}>
          {isVotingMode ? 'COMMANDER SELECTION' : 'PRIORITY AUCTION'}
        </h1>
        <p className="text-center mb-6 font-mono uppercase tracking-widest text-xs text-white/60">
          {isVotingMode ? 'NOMINATE STARTING COMMANDER' : 'BID RESOURCES FOR INITIATIVE'}
        </p>

        {/* Current Player */}
        <div className="mb-6 p-4 rounded-lg text-center border-2 border-[#4caf50] bg-[#4caf50]/10">
          <p className="text-xs font-mono tracking-widest text-white/50 uppercase">YOUR TURN</p>
          <h2 className="text-xl font-bold uppercase text-white" style={{ fontFamily: 'var(--font-header)' }}>
            {currentPlayer.name}
          </h2>
          {isBiddingMode && (
            <div className="mt-2 text-[10px] text-white/60 grid grid-cols-4 gap-1 font-mono uppercase">
              {resourceTypes.map(res => (
                <span key={res} style={{ color: RESOURCE_COLORS[res] }}>
                  {resourceNames[res].slice(0, 3)}: {currentPlayer.resources[res]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Voting Mode */}
        {isVotingMode && (
          <div className="space-y-3">
            <p className="text-white/50 text-[10px] text-center mb-4 uppercase font-mono tracking-widest">
              SELECT WHO SHOULD GO FIRST
            </p>
            {players
              .filter(p => p.id !== currentPlayer.id)
              .map(player => (
                <button
                  key={player.id}
                  onClick={() => handleVoteClick(player.id)}
                  className="w-full py-3 px-4 rounded border-2 border-[#4caf50] flex items-center justify-between hover:bg-[#4caf50] hover:text-black transition-all duration-300 group bg-black"
                >
                  <span className="font-bold text-white uppercase tracking-wider group-hover:text-black" style={{ fontFamily: 'var(--font-header)' }}>{player.name}</span>
                  <span className="text-xs text-[#4caf50] font-mono uppercase group-hover:text-black">[ VOTE ]</span>
                </button>
              ))}

            {votedPlayerIds.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#4caf50]/30">
                <p className="text-[10px] text-white/40 mb-2 uppercase font-mono tracking-widest">VOTES: {votedPlayerIds.length}/{playerCount}</p>
                <div className="flex flex-wrap gap-2">
                  {votedPlayerIds.map(id => {
                    const voter = state.players[id];
                    return (
                      <span key={id} className="px-2 py-0.5 rounded text-[10px] border border-[#4caf50] font-mono uppercase bg-[#4caf50]/20 text-[#4caf50]">
                        {voter.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {state.firstPlayerSelection && state.firstPlayerSelection.revoteCount > 0 && (
              <div className="mt-4 p-3 bg-[#4caf50]/10 rounded border border-[#4caf50]">
                <p className="text-[#4caf50] text-xs text-center font-mono uppercase animate-pulse">
                  ⚠ TIE DETECTED // RE-VOTE #{state.firstPlayerSelection.revoteCount}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bidding Mode */}
        {isBiddingMode && (
          <div className="space-y-4">
            <p className="text-white/50 text-[10px] text-center uppercase font-mono tracking-widest">
              BID RESOURCES TO GO FIRST
            </p>

            <div className="grid grid-cols-4 gap-2">
              {resourceTypes.map(res => {
                const current = bid[res] || 0;
                const max = currentPlayer.resources[res];

                return (
                  <div key={res} className="flex flex-col items-center p-2 rounded bg-black border border-[#4caf50]/50">
                    <div className="w-10 h-10 rounded flex items-center justify-center text-lg font-bold font-mono bg-black mb-1 border border-[#4caf50] text-white">
                      {current}
                    </div>
                    <span className="text-[10px] mt-1 uppercase font-bold tracking-wider" style={{ color: RESOURCE_COLORS[res] }}>
                      {resourceNames[res].slice(0, 3)}
                    </span>
                    <div className="flex gap-1 mt-1 w-full">
                      <button
                        onClick={() => setBid({ ...bid, [res]: Math.max(0, current - 1) })}
                        disabled={current === 0}
                        className="flex-1 h-6 rounded bg-black hover:bg-[#4caf50] hover:text-black text-white text-xs disabled:opacity-30 border border-[#4caf50] transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setBid({ ...bid, [res]: Math.min(max, current + 1) })}
                        disabled={current >= max}
                        className="flex-1 h-6 rounded bg-black hover:bg-[#4caf50] hover:text-black text-white text-xs disabled:opacity-30 border border-[#4caf50] transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[9px] text-white/40 font-mono mt-1">MAX: {max}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-center p-3 border border-[#4caf50] bg-black rounded">
              <p className="text-white/50 text-[10px] font-mono uppercase tracking-widest">TOTAL BID</p>
              <p className="text-2xl font-bold text-[#4caf50] font-mono">{bidTotal} RESOURCES</p>
            </div>

            <button
              onClick={handleBidSubmit}
              className="w-full py-3 bg-[#4caf50] text-black border-2 border-[#4caf50] hover:bg-[#66bb6a] font-bold uppercase tracking-widest transition-all duration-300 rounded"
              style={{ fontFamily: 'var(--font-header)' }}
            >
              CONFIRM BID
            </button>

            {bidPlayerIds.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#4caf50]/30">
                <p className="text-[10px] text-white/40 mb-1 font-mono uppercase">BIDS: {bidPlayerIds.length}/{playerCount}</p>
                <div className="flex flex-wrap gap-2">
                  {bidPlayerIds.map(id => {
                    const bidder = state.players[id];
                    return (
                      <span key={id} className="px-2 py-0.5 rounded text-[10px] border border-[#4caf50] font-mono uppercase bg-[#4caf50]/20 text-[#4caf50]">
                        {bidder.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {state.firstPlayerSelection && state.firstPlayerSelection.revoteCount > 0 && (
              <div className="mt-2 p-3 bg-[#4caf50]/10 rounded border border-[#4caf50]">
                <p className="text-[#4caf50] text-xs text-center font-mono uppercase animate-pulse">
                  ⚠ TIE DETECTED // RE-BID #{state.firstPlayerSelection.revoteCount}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
