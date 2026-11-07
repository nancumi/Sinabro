'use client';

import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 0) return null;

  // 5개 단위 블록 계산
  const blockSize = 5;
  const currentBlock = Math.ceil(currentPage / blockSize);
  const startPage = (currentBlock - 1) * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center gap-1.5 py-3 text-[12px] select-none">
      {/* 맨 처음 페이지 (<<) */}
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={isFirst}
        className={`p-1.5 rounded-lg border transition-colors ${
          isFirst
            ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
            : 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white bg-slate-900'
        }`}
        title="처음 페이지"
        aria-label="처음 페이지"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* 이전 페이지 (<) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={`p-1.5 rounded-lg border transition-colors ${
          isFirst
            ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
            : 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white bg-slate-900'
        }`}
        title="이전 페이지"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* 페이지 번호 목록 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-8 h-8 px-2 rounded-lg text-[12px] font-medium transition-colors border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm font-semibold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 다음 페이지 (>) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        className={`p-1.5 rounded-lg border transition-colors ${
          isLast
            ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
            : 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white bg-slate-900'
        }`}
        title="다음 페이지"
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* 맨 끝 페이지 (>>) */}
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={isLast}
        className={`p-1.5 rounded-lg border transition-colors ${
          isLast
            ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
            : 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white bg-slate-900'
        }`}
        title="마지막 페이지"
        aria-label="마지막 페이지"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};
