'use client';

import React, { useState, useMemo } from 'react';
import { ContentItem, Category } from '@/types';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import { Play, Plus, Compass } from 'lucide-react';

interface ContentMenuListProps {
  contents: ContentItem[];
  categories: Category[];
  selectedCategoryId: string;
  selectedContentId: string | null;
  onSelectContent: (content: ContentItem) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const ContentMenuList: React.FC<ContentMenuListProps> = ({
  contents,
  categories,
  selectedCategoryId,
  selectedContentId,
  onSelectContent,
  isAdmin,
  onOpenAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 필터링
  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      const matchCategory =
        !selectedCategoryId || selectedCategoryId === 'cat-all' || item.categoryId === selectedCategoryId;
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [contents, selectedCategoryId, searchQuery]);

  // 페이지 계산
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContents, currentPage, itemsPerPage]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-3 space-y-3">
      {/* 헤더 & 검색창 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-[12px] text-slate-100">
              콘텐츠 목록 ({filteredContents.length})
            </h3>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
            >
              <Plus className="w-3 h-3 text-sky-300" />
              콘텐츠 추가
            </button>
          )}
        </div>

        {/* 검색창 컴포넌트 (규칙: x 아이콘, 오토포커스) */}
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="시간 때우기 콘텐츠 검색..."
        />
      </div>

      {/* 메뉴 리스트 */}
      <div className="space-y-1.5 min-h-[220px]">
        {paginatedContents.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400 p-4 space-y-2">
            <p className="text-[12px] text-slate-300">등록된 콘텐츠가 없습니다.</p>
            {isAdmin ? (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
              >
                새 Vercel 콘텐츠 등록하기
              </button>
            ) : (
              <p className="text-[11px] text-slate-500">
                곧 흥미로운 시간 때우기 콘텐츠가 추가될 예정입니다.
              </p>
            )}
          </div>
        ) : (
          paginatedContents.map((item) => {
            const isSelected = item.id === selectedContentId;
            const categoryName =
              categories.find((c) => c.id === item.categoryId)?.name || '';

            return (
              <div
                key={item.id}
                onClick={() => onSelectContent(item)}
                className={`group flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-500/70 shadow-xs'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div className="space-y-0.5 flex-1 min-w-0 mr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[12px] text-slate-100 truncate">
                      {item.title}
                    </span>
                    {categoryName && (
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded shrink-0 border border-slate-700/50">
                        {categoryName}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center">
                  <span
                    className={`p-1.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-sky-950 group-hover:text-sky-300'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 페이지네이션 (규칙: << < 1 2 3 4 5 > >> 5개 블록 레이아웃) */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
