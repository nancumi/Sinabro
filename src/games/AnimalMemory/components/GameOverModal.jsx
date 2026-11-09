import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

export default function GameOverModal({
  winner,
  sequenceLength,
  onRestart,
}) {
  useEffect(() => {
    sound.playVictory();
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#f43f5e', '#fbbf24', '#34d399'],
      });
    } catch {}
  }, []);

  const handleRestart = () => {
    sound.playClick();
    onRestart();
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center text-center py-4 animate-fade-in select-none">
      {/* 우승 트로피 아이콘 */}
      <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_30px_rgba(251,191,36,0.5)] animate-bounce">
        <Trophy size={34} />
      </div>

      <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
        <Sparkles size={11} className="text-amber-400" />
        <span>최후의 1인 서바이벌 우승</span>
      </div>

      <h2 className="text-[20px] font-black text-white leading-tight mb-2">
        {winner?.name} 님 우승!
      </h2>

      {/* 달성 기록 카드 */}
      <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 mb-4 flex items-center justify-around">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block">
            누적 기억 성공
          </span>
          <span className="text-[17px] font-black text-sky-400">
            {sequenceLength}
            <span className="text-[11px] font-medium text-slate-400 ml-0.5">마리</span>
          </span>
        </div>
        <div className="w-px h-7 bg-slate-800" />
        <div>
          <span className="text-[10px] text-slate-400 font-bold block">
            승리 상태
          </span>
          <span className="text-[12px] font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
            <Award size={14} />
            생존 완료
          </span>
        </div>
      </div>

      {/* 다시하기 버튼 */}
      <button
        type="button"
        onClick={handleRestart}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-[12px] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
      >
        <RotateCcw size={14} />
        <span>새 게임 시작하기</span>
      </button>
    </div>
  );
}

