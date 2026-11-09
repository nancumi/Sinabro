import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * 모달 컴포넌트
 * - 바깥 영역 클릭시 창 닫힘
 * - 바깥 영역 마우스 이동시 마우스 모양 변경하지 않음 (cursor-default)
 * - 버튼 글자 크기 12px, 버튼 색상 파스텔톤
 * - 최소 글자 크기 11px, 기본 글자 크기 12px
 */
export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-default select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 text-[12px] text-slate-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-1 text-[12px]">
          {children}
        </div>

        {footer && (
          <div className="pt-2 border-t border-slate-800 flex justify-end gap-2 text-[12px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

