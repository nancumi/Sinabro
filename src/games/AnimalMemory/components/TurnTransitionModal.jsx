import React from 'react';
import { ArrowRight, CheckCircle2, AlertOctagon, Skull } from 'lucide-react';
import { sound } from '../utils/sound';

export default function TurnTransitionModal({
  isOpen,
  type, // 'nextTurn' | 'eliminated'
  eliminatedPlayer,
  nextPlayer,
  sequenceLength,
  onProceed,
}) {
  if (!isOpen) return null;

  const handleProceed = () => {
    sound.playClick();
    onProceed();
  };

  const isElimination = type === 'eliminated';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center">
        {/* 상단 상태 아이콘 */}
        {isElimination ? (
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 mb-3 shadow-[0_0_25px_rgba(244,63,94,0.4)] animate-bounce">
            <Skull size={30} />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <CheckCircle2 size={30} />
          </div>
        )}

        {/* 뱃지 및 메인 안내 */}
        <span
          className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
            isElimination ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {isElimination ? 'ELIMINATED!' : 'SUCCESS!'}
        </span>

        <h3 className="text-[17px] font-black text-white leading-tight mb-1.5">
          {isElimination
            ? `${eliminatedPlayer?.name} 탈락!`
            : '동물 추가 완료!'}
        </h3>

        <p className="text-[11px] text-slate-300 mb-4 leading-relaxed">
          {isElimination ? (
            <span>
              기억 순서를 틀렸습니다.<br />
              현재 누적 동물 수: <b className="text-white">{sequenceLength}마리</b>
            </span>
          ) : (
            <span>
              스마트폰을 다음 플레이어에게 넘겨주세요!<br />
              외워야 할 동물: <b className="text-white">{sequenceLength}마리</b>
            </span>
          )}
        </p>

        {/* 다음 플레이어 안내 카드 */}
        {nextPlayer && (
          <div
            className={`w-full p-2.5 rounded-xl border flex items-center justify-center gap-2 mb-4 ${nextPlayer.color.bg} ${nextPlayer.color.border}`}
          >
            <span className="text-[11px] text-slate-400 font-medium">다음 차례:</span>
            <span
              className={`text-[12px] font-extrabold ${nextPlayer.color.text}`}
            >
              {nextPlayer.name}
            </span>
          </div>
        )}

        {/* 확인 및 진행 버튼 */}
        <button
          type="button"
          onClick={handleProceed}
          className={`w-full py-3 px-4 rounded-xl font-bold text-[12px] shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer ${
            isElimination
              ? 'bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white shadow-rose-500/20'
              : 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-sky-500/20'
          }`}
        >
          <span>{isElimination ? '서바이벌 계속하기' : '준비 완료 (도전 시작)'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
