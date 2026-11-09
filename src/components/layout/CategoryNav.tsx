'use client';

import React, { useState } from 'react';
import { Category, ContentItem } from '@/types';
import { Plus, ChevronDown, ChevronUp, Play } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  contents?: ContentItem[];
  selectedContentId?: string | null;
  onSelectContent?: (item: ContentItem) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  contents = [],
  selectedContentId,
  onSelectContent,
  isAdmin,
  onOpenAdmin,
}) => {
  const [openSubmenuCatId, setOpenSubmenuCatId] = useState<string | null>(null);

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    // 같은 카테고리 클릭 시 서브메뉴 토글 닫기, 다른 카테고리 클릭 시 열기
    setOpenSubmenuCatId((prev) => (prev === catId ? null : catId));
  };

  // 현재 열린 서브메뉴에 해당하는 콘텐츠 목록 필터링
  const submenuContents = openSubmenuCatId
    ? openSubmenuCatId === 'cat-all'
      ? contents
      : contents.filter((c) => c.categoryId === openSubmenuCatId)
    : [];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 transition-all select-none">
      {/* 1. 카테고리 탭 메인 바 */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 py-2">
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            const isSubmenuOpen = cat.id === openSubmenuCatId;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all border cursor-pointer active:scale-95 ${
                  isSelected || isSubmenuOpen
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm font-semibold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                {isSubmenuOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-blue-200" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white opacity-70" />
                )}
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-sky-950/70 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors ml-2 cursor-pointer"
            title="카테고리 추가/편집"
          >
            <Plus className="w-3 h-3 text-sky-300" />
            <span>카테고리 편집</span>
          </button>
        )}
      </div>

      {/* 2. 서브 메뉴 드롭다운 영역 (하위 광고 슬롯과 게임 화면을 자연스럽게 밑으로 밀어냄) */}
      {openSubmenuCatId && (
        <div className="w-full bg-slate-950/95 border-t border-slate-800/80 py-2.5 px-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] text-sky-400 uppercase tracking-widest font-bold shrink-0 mr-1 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-sky-400" />
              게임 목록
            </span>

            {submenuContents.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic py-1">
                등록된 콘텐츠가 없습니다.
              </span>
            ) : (
              submenuContents.map((content) => {
                const isActive = content.id === selectedContentId;
                return (
                  <button
                    key={`submenu-item-${content.id}`}
                    type="button"
                    onClick={() => {
                      if (onSelectContent) {
                        onSelectContent(content);
                      }
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)] ring-1 ring-sky-400'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    <span>{content.title}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
