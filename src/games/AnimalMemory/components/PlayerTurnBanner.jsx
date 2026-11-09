import React from 'react';
import { Crown, Skull, Sparkles } from 'lucide-react';

export default function PlayerTurnBanner({
  players,
  currentPlayerIndex,
  sequenceLength,
  inputStep,
}) {
  const currentPlayer = players[currentPlayerIndex];
  const isAddingNew = inputStep >= sequenceLength;

  return (
    <div className="w-full flex flex-col gap-2.5 mb-2 select-none">
      {/* 1. 플레이어 상태 태그 뱃지 리스트 */}
      <div className="w-full flex items-center justify-center gap-1.5 flex-wrap">
        {players.map((p, idx) => {
          const isCurrent = idx === currentPlayerIndex && !p.isEliminated;
          const isEliminated = p.isEliminated;

          return (
            <div
              key={`player-badge-${p.id}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                isEliminated
                  ? 'bg-slate-900/40 border-slate-800/60 text-slate-600 line-through opacity-50'
                  : isCurrent
                  ? `${p.color.bg} ${p.color.border} ${p.color.text} shadow-[0_0_15px_rgba(56,189,248,0.2)] ring-1.5 ${p.color.ring} scale-105`
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-80'
              }`}
            >
              {isEliminated ? (
                <Skull size={11} className="text-slate-600 shrink-0" />
              ) : isCurrent ? (
                <Crown size={11} className="text-amber-400 shrink-0 animate-bounce" />
              ) : (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.color.hex }}
                />
              )}
              <span className="truncate max-w-[70px]">{p.name}</span>
            </div>
          );
        })}
      </div>

      {/* 2. 현재 턴 플레이어 행동 안내 대시보드 */}
      {currentPlayer && (
        <div
          className={`w-full p-2.5 rounded-2xl border flex items-center justify-between shadow-lg ${currentPlayer.color.bg} ${currentPlayer.color.border}`}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black text-slate-950 shrink-0 shadow-md"
              style={{ backgroundColor: currentPlayer.color.hex }}
            >
              {currentPlayerIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className={`text-[12px] font-black ${currentPlayer.color.text}`}>
                  {currentPlayer.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">차례</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-200">
                {isAddingNew ? (
                  <span className="text-amber-300 font-extrabold flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-400 animate-spin" />
                    새로운 동물 1마리를 추가하세요!
                  </span>
                ) : (
                  <span>
                    앞사람의 기억 순서 탭:{' '}
                    <span className="text-sky-400 font-extrabold">
                      {inputStep + 1}
                    </span>{' '}
                    / {sequenceLength}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 현재 누적 암기 길이 뱃지 */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              누적 암기
            </span>
            <span className="text-[14px] font-black text-white">
              {sequenceLength}
              <span className="text-[10px] font-normal text-slate-400 ml-0.5">마리</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
