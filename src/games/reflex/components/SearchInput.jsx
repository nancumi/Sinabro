import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * 요구 규칙을 충족하는 검색창 컴포넌트:
 * - 글자 입력 시 오른쪽에 x 아이콘 표시
 * - x 아이콘 클릭 시 검색어 지운 후 오토포커스
 * - 기본 글자 크기 12px
 */
export default function SearchInput({ value, onChange, placeholder = "기록 검색 (등급, ms 등)..." }) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
        <Search size={14} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-8 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-[12px] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
      {value && value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
          title="검색어 지우기"
          aria-label="검색어 지우기"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

