import React, { useRef } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchInput({
  value,
  onChange,
  placeholder = '검색어를 입력하세요',
  className = '',
}) {
  const inputRef = useRef(null)

  const handleClear = () => {
    onChange('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className={`relative flex items-center text-[12px] ${className}`}>
      <Search
        size={14}
        className="absolute left-2.5 text-slate-400 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-[12px] placeholder:text-slate-400 placeholder:text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 text-slate-400 hover:text-slate-600 rounded-full p-0.5 hover:bg-slate-100 transition-colors"
          title="검색어 지우기"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}

