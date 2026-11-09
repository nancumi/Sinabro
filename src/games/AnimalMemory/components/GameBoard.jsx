import React, { useState } from 'react';
import { ANIMALS } from '../utils/animals';

export default function GameBoard({
  animals = ANIMALS,
  onTileClick,
  disabled,
  activeTileId,
  statusEffect, // 'correct' | 'wrong' | 'added' | null
}) {
  return (
    <div className="w-full max-w-[360px] sm:max-w-[380px] aspect-square mx-auto p-2 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl flex items-center justify-center select-none touch-none">
      <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
        {animals.map((animal) => {
          const isActive = activeTileId === animal.id;

          let highlightClasses = 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/50';
          if (isActive) {
            if (statusEffect === 'wrong') {
              highlightClasses = 'border-rose-500 bg-rose-500/30 ring-4 ring-rose-500/50 scale-105 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-shake';
            } else if (statusEffect === 'added') {
              highlightClasses = 'border-amber-400 bg-amber-400/30 ring-4 ring-amber-400/50 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.6)]';
            } else {
              highlightClasses = 'border-sky-400 bg-sky-400/25 ring-4 ring-sky-400/50 scale-105 shadow-[0_0_20px_rgba(56,189,248,0.6)]';
            }
          }

          return (
            <button
              key={`animal-tile-${animal.id}`}
              type="button"
              disabled={disabled}
              onClick={() => onTileClick(animal.id)}
              className={`relative flex flex-col items-center justify-center rounded-2xl border transition-all duration-150 cursor-pointer active:scale-90 disabled:opacity-60 disabled:cursor-not-allowed ${highlightClasses}`}
            >
              {/* 귀여운 동물 이모지 */}
              <span className="text-2xl sm:text-3xl filter drop-shadow-md transform transition-transform group-hover:scale-110">
                {animal.emoji}
              </span>

              {/* 한글 동물 이름 라벨 */}
              <span className="text-[10px] font-bold text-slate-300 mt-1 tracking-tight">
                {animal.name}
              </span>

              {/* 하이라이트 시 중앙 펄스 글로우 */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-2xl opacity-40 animate-pulse pointer-events-none"
                  style={{ backgroundColor: animal.color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

