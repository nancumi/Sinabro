import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

/**
 * 요구 규칙을 정확하게 반영한 Pagination 컴포넌트:
 * - << < 1 2 3 4 5 > >> 레이아웃
 * - 5개 페이지 블록이 기본 단위, 전체 페이지가 적다면 그 개수에 맞추어 렌더링
 * - << 는 맨 처음 페이지 currentPage = 1로 이동, 첫 페이지일 때 비활성화
 * - < 는 이전 페이지 currentPage = currentPage - 1로 이동, 첫 페이지일 때 비활성화
 * - 페이지 번호는 현재 활성화된 페이지를 파란색 배경의 고유 스타일로 표시하고 현재 페이지가 속한 5개 단위 블록을 노출
 * - > 는 다음 페이지 currentPage = currentPage + 1로 이동, 마지막 페이지일 때 비활성화
 * - >> 는 맨 끝 페이지 currentPage = totalPages로 이동, 마지막 페이지일 때 비활성화
 * - 아이콘: ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight (lucide-react)
 * - 최소 글자 11px, 기본 12px
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 0) return null;

  // 5개 단위 블록 계산
  const currentBlock = Math.floor((currentPage - 1) / 5);
  const startPage = currentBlock * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center gap-1 select-none text-[12px] py-2">
      {/* 맨 처음 페이지 (<<) */}
      <button
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(1)}
        className={`p-1.5 rounded flex items-center justify-center transition-colors text-[12px] ${
          isFirst
            ? 'text-slate-600 cursor-not-allowed opacity-40'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        title="처음 페이지"
        aria-label="처음 페이지"
      >
        <ChevronsLeft size={14} />
      </button>

      {/* 이전 페이지 (<) */}
      <button
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className={`p-1.5 rounded flex items-center justify-center transition-colors text-[12px] ${
          isFirst
            ? 'text-slate-600 cursor-not-allowed opacity-40'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        title="이전 페이지"
        aria-label="이전 페이지"
      >
        <ChevronLeft size={14} />
      </button>

      {/* 5개 단위 페이지 번호 블록 */}
      {pageNumbers.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`min-w-[28px] h-7 px-2 flex items-center justify-center rounded text-[12px] font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 페이지 (>) */}
      <button
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className={`p-1.5 rounded flex items-center justify-center transition-colors text-[12px] ${
          isLast
            ? 'text-slate-600 cursor-not-allowed opacity-40'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        title="다음 페이지"
        aria-label="다음 페이지"
      >
        <ChevronRight size={14} />
      </button>

      {/* 맨 끝 페이지 (>>) */}
      <button
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(totalPages)}
        className={`p-1.5 rounded flex items-center justify-center transition-colors text-[12px] ${
          isLast
            ? 'text-slate-600 cursor-not-allowed opacity-40'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        title="마지막 페이지"
        aria-label="마지막 페이지"
      >
        <ChevronsRight size={14} />
      </button>
    </div>
  );
}

