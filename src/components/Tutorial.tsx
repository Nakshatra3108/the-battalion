'use client';

import React, { useState } from 'react';

interface TutorialProps {
  onClose: () => void;
}

// Configure your slides here - just add/remove image paths as needed
// Place your slide images in the public/slides folder (e.g., public/slides/slide-1.png)
const SLIDES = [
  '/slides/slide-1.png',
  '/slides/slide-2.png',
  '/slides/slide-3.png',
  '/slides/slide-4.png',
  '/slides/slide-5.png',
  '/slides/slide-6.png',
  '/slides/slide-7.png',
  '/slides/slide-8.png',
];

export default function Tutorial({ onClose }: TutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState(false);

  const goNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setImageError(false);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setImageError(false);
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

  return (
    <div
      className="fixed inset-0 bg-[#000000]/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-[#0a0a0a] border-2 border-[#4caf50] rounded-lg max-w-5xl w-full max-h-[95vh] flex flex-col shadow-[0_0_50px_rgba(76,175,80,0.2)] font-mono relative overflow-hidden">

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#4caf50]/30 bg-[#0a0a0a] relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(76,175,80,0.5)]">📋</span>
            <h2 className="text-xl font-bold text-[#4caf50] uppercase tracking-widest">
              MISSION BRIEFING
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
            {SLIDES.map((_, index) => (
              <div
                key={index}
                className={`flex-1 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide
                  ? 'bg-[#4caf50] shadow-[0_0_10px_#4caf50]'
                  : index < currentSlide
                    ? 'bg-[#4caf50]/40'
                    : 'bg-[#4caf50]/10'
                  }`}
                onClick={() => {
                  setCurrentSlide(index);
                  setImageError(false);
                }}
              />
            ))}
          </div>
          <p className="text-right text-[#4caf50]/70 text-[10px] mt-1 uppercase tracking-wider">
            SLIDE {currentSlide + 1} / {SLIDES.length}
          </p>
        </div>

        {/* Slide Content */}
        <div className="flex-1 overflow-hidden p-4 relative z-10 flex items-center justify-center bg-black/50">
          {imageError ? (
            <div className="text-center text-[#4caf50]/60">
              <p className="text-lg mb-2">⚠️ Slide Not Found</p>
              <p className="text-sm">
                Please add slide images to: <br />
                <code className="text-[#f44336]">public/slides/slide-{currentSlide + 1}.png</code>
              </p>
            </div>
          ) : (
            <img
              src={SLIDES[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="max-w-full max-h-[calc(95vh-200px)] object-contain rounded-lg shadow-lg"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-[#4caf50]/30 bg-[#0a0a0a] relative z-10">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className={`px-4 py-2 rounded font-bold uppercase tracking-wider text-xs transition-all ${currentSlide === 0
              ? 'text-[#4caf50]/20 cursor-not-allowed border border-[#4caf50]/10'
              : 'text-[#4caf50] border border-[#4caf50]/50 hover:bg-[#4caf50]/10 hover:shadow-[0_0_10px_rgba(76,175,80,0.2)]'
              }`}
          >
            ← PREV
          </button>

          {/* Quick Nav Dots */}
          <div className="hidden md:flex gap-1.5 flex-wrap justify-center sm:max-w-[50%]">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSlide(i);
                  setImageError(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide
                  ? 'bg-[#4caf50] shadow-[0_0_5px_#4caf50] scale-125'
                  : 'bg-[#4caf50]/20 hover:bg-[#4caf50]/50'
                  }`}
                title={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {currentSlide === SLIDES.length - 1 ? (
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

        {/* Keyboard hint */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[#4caf50]/60 text-[10px] uppercase tracking-wider">
          Use arrow keys or spacebar to navigate
        </div>
      </div>
    </div>
  );
}
