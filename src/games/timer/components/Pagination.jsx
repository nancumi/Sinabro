import React from 'react'
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react'

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  const safeTotalPages = Math.max(1, totalPages)
  const blockSize = 5
  const currentBlock = Math.ceil(currentPage / blockSize)
  const startPage = (currentBlock - 1) * blockSize + 1
  const endPage = Math.min(startPage + blockSize - 1, safeTotalPages)

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  const isFirst = currentPage <= 1
  const isLast = currentPage >= safeTotalPages

  return (
    <div className="flex items-center justify-center gap-1 py-3 text-[12px] select-none">
      {/* 맨 처음 페이지 (<<) */}
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={isFirst}
        className={`flex h-7 w-7 items-center justify-center rounded-md border text-[11px] transition-colors ${
          isFirst
            ? 'cursor-not-allowed border-slate-200 text-slate-300 bg-slate-50'
            : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white'
        }`}
        title="맨 처음 페이지"
      >
        <ChevronsLeft size={14} />
      </button>

      {/* 이전 페이지 (<) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={`flex h-7 w-7 items-center justify-center rounded-md border text-[11px] transition-colors ${
          isFirst
            ? 'cursor-not-allowed border-slate-200 text-slate-300 bg-slate-50'
            : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white'
        }`}
        title="이전 페이지"
      >
        <ChevronLeft size={14} />
      </button>

      {/* 페이지 번호 목록 */}
      {pages.map((p) => {
        const isActive = p === currentPage
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex h-7 min-w-[28px] px-1.5 items-center justify-center rounded-md text-[12px] font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        )
      })}

      {/* 다음 페이지 (>) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        className={`flex h-7 w-7 items-center justify-center rounded-md border text-[11px] transition-colors ${
          isLast
            ? 'cursor-not-allowed border-slate-200 text-slate-300 bg-slate-50'
            : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white'
        }`}
        title="다음 페이지"
      >
        <ChevronRight size={14} />
      </button>

      {/* 맨 끝 페이지 (>>) */}
      <button
        type="button"
        onClick={() => onPageChange(safeTotalPages)}
        disabled={isLast}
        className={`flex h-7 w-7 items-center justify-center rounded-md border text-[11px] transition-colors ${
          isLast
            ? 'cursor-not-allowed border-slate-200 text-slate-300 bg-slate-50'
            : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white'
        }`}
        title="맨 끝 페이지"
      >
        <ChevronsRight size={14} />
      </button>
    </div>
  )
}

