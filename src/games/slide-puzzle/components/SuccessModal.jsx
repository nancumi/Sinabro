import React from 'react';
import { Trophy, Clock, Footprints, RotateCcw, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, onRestart, moves, timeString, imageUrl }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm cursor-default p-4 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl text-neutral-100 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        style={{ fontSize: '12px' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-neutral-400 hover:text-neutral-200 transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-400">
          <Trophy className="w-6 h-6 animate-bounce" />
        </div>

        <h3 className="font-semibold text-neutral-100 mb-1" style={{ fontSize: '15px' }}>
          축하합니다!
        </h3>
        <p className="text-neutral-400 text-center mb-4" style={{ fontSize: '12px' }}>
          5x5 슬라이딩 퍼즐을 완벽하게 맞추셨습니다.
        </p>

        {imageUrl && (
          <div className="w-32 h-32 rounded-xl overflow-hidden border border-neutral-700/80 mb-4 shadow-md">
            <img src={imageUrl} alt="완성된 퍼즐" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="w-full grid grid-cols-2 gap-2 mb-5">
          <div className="bg-neutral-800/80 rounded-xl p-2.5 flex flex-col items-center justify-center border border-neutral-700/50">
            <div className="flex items-center gap-1 text-neutral-400 mb-1" style={{ fontSize: '11px' }}>
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>경과 시간</span>
            </div>
            <span className="font-mono font-medium text-neutral-100" style={{ fontSize: '13px' }}>
              {timeString}
            </span>
          </div>

          <div className="bg-neutral-800/80 rounded-xl p-2.5 flex flex-col items-center justify-center border border-neutral-700/50">
            <div className="flex items-center gap-1 text-neutral-400 mb-1" style={{ fontSize: '11px' }}>
              <Footprints className="w-3.5 h-3.5 text-emerald-400" />
              <span>이동 횟수</span>
            </div>
            <span className="font-mono font-medium text-neutral-100" style={{ fontSize: '13px' }}>
              {moves}회
            </span>
          </div>
        </div>

        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg font-medium transition-all duration-150 active:scale-95 shadow-sm"
            style={{
              fontSize: '12px',
              backgroundColor: '#dbeafe', // 파스텔 소프트 블루
              color: '#1e3a8a'
            }}
          >
            기록 확인
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-2 rounded-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
            style={{
              fontSize: '12px',
              backgroundColor: '#bbf7d0', // 파스텔 소프트 그린
              color: '#14532d'
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새 게임</span>
          </button>
        </div>
      </div>
    </div>
  );
}

