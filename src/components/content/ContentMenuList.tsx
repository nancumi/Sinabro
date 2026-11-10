'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ContentItem, Category } from '@/types';
import { SearchBar } from '@/components/common/SearchBar';
import { Pagination } from '@/components/common/Pagination';
import {
  Play,
  Plus,
  Compass,
  Timer,
  RotateCw,
  Fingerprint,
  Shuffle,
  Hammer,
  Binary,
  Puzzle,
  Zap,
  PenTool,
  Brain,
  Megaphone,
  Gamepad2,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';

interface ContentMenuListProps {
  contents: ContentItem[];
  categories: Category[];
  selectedCategoryId: string;
  selectedContentId: string | null;
  onSelectContent: (content: ContentItem) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

interface GameIconConfig {
  icon: React.ComponentType<{ className?: string }>;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

// 게임별 전용 SVG 아이콘 및 테마 컬러 매핑
export function getContentIconConfig(title: string = '', url: string = ''): GameIconConfig {
  const t = title.toLowerCase();
  const u = url.toLowerCase();

  if (t.includes('전광판') || t.includes('led') || u.includes('led')) {
    return {
      icon: Megaphone,
      bgClass: 'bg-rose-500/15 group-hover:bg-rose-500/25',
      borderClass: 'border-rose-500/30 group-hover:border-rose-400/60',
      textClass: 'text-rose-400 group-hover:text-rose-300',
    };
  }
  if (t.includes('동물') || t.includes('기억력') || u.includes('animal')) {
    return {
      icon: Brain,
      bgClass: 'bg-fuchsia-500/15 group-hover:bg-fuchsia-500/25',
      borderClass: 'border-fuchsia-500/30 group-hover:border-fuchsia-400/60',
      textClass: 'text-fuchsia-400 group-hover:text-fuchsia-300',
    };
  }
  if (t.includes('한 붓') || t.includes('한붓') || u.includes('stroke')) {
    return {
      icon: PenTool,
      bgClass: 'bg-teal-500/15 group-hover:bg-teal-500/25',
      borderClass: 'border-teal-500/30 group-hover:border-teal-400/60',
      textClass: 'text-teal-400 group-hover:text-teal-300',
    };
  }
  if (t.includes('시간') || t.includes('타이머') || u.includes('timer')) {
    return {
      icon: Timer,
      bgClass: 'bg-amber-500/15 group-hover:bg-amber-500/25',
      borderClass: 'border-amber-500/30 group-hover:border-amber-400/60',
      textClass: 'text-amber-400 group-hover:text-amber-300',
    };
  }
  if (t.includes('손가락') || t.includes('터치') || u.includes('finger-touch') || u.includes('touch')) {
    return {
      icon: Fingerprint,
      bgClass: 'bg-pink-500/15 group-hover:bg-pink-500/25',
      borderClass: 'border-pink-500/30 group-hover:border-pink-400/60',
      textClass: 'text-pink-400 group-hover:text-pink-300',
    };
  }
  if (t.includes('룰렛') || u.includes('roulette')) {
    return {
      icon: RotateCw,
      bgClass: 'bg-purple-500/15 group-hover:bg-purple-500/25',
      borderClass: 'border-purple-500/30 group-hover:border-purple-400/60',
      textClass: 'text-purple-400 group-hover:text-purple-300',
    };
  }
  if (t.includes('사다리') || u.includes('ladder')) {
    return {
      icon: Shuffle,
      bgClass: 'bg-orange-500/15 group-hover:bg-orange-500/25',
      borderClass: 'border-orange-500/30 group-hover:border-orange-400/60',
      textClass: 'text-orange-400 group-hover:text-orange-300',
    };
  }
  if (t.includes('두더지') || u.includes('mole')) {
    return {
      icon: Hammer,
      bgClass: 'bg-emerald-500/15 group-hover:bg-emerald-500/25',
      borderClass: 'border-emerald-500/30 group-hover:border-emerald-400/60',
      textClass: 'text-emerald-400 group-hover:text-emerald-300',
    };
  }
  if (t.includes('2048') || t.includes('숫자') || u.includes('number-merge')) {
    return {
      icon: Binary,
      bgClass: 'bg-blue-500/15 group-hover:bg-blue-500/25',
      borderClass: 'border-blue-500/30 group-hover:border-blue-400/60',
      textClass: 'text-blue-400 group-hover:text-blue-300',
    };
  }
  if (t.includes('반응') || u.includes('reflex')) {
    return {
      icon: Zap,
      bgClass: 'bg-yellow-500/15 group-hover:bg-yellow-500/25',
      borderClass: 'border-yellow-500/30 group-hover:border-yellow-400/60',
      textClass: 'text-yellow-400 group-hover:text-yellow-300',
    };
  }
  if (t.includes('퍼즐') || u.includes('puzzle')) {
    return {
      icon: Puzzle,
      bgClass: 'bg-cyan-500/15 group-hover:bg-cyan-500/25',
      borderClass: 'border-cyan-500/30 group-hover:border-cyan-400/60',
      textClass: 'text-cyan-400 group-hover:text-cyan-300',
    };
  }

  return {
    icon: Gamepad2,
    bgClass: 'bg-sky-500/15 group-hover:bg-sky-500/25',
    borderClass: 'border-sky-500/30 group-hover:border-sky-400/60',
    textClass: 'text-sky-400 group-hover:text-sky-300',
  };
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // 로컬 스토리지에서 사용자가 선호하는 뷰 모드 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sinabro_menu_view_mode');
      if (saved === 'list' || saved === 'grid') {
        setViewMode(saved);
      }
    }
  }, []);

  const handleToggleViewMode = (mode: 'list' | 'grid') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sinabro_menu_view_mode', mode);
    }
  };

  const itemsPerPage = viewMode === 'grid' ? 6 : 6;

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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-[12px] text-slate-100">
                콘텐츠 목록 ({filteredContents.length})
              </h3>
            </div>

            {/* 리스트형 / 그리드형 뷰 모드 토글 버튼 */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleViewMode('list')}
                title="리스트형 보기"
                className={`p-1 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleViewMode('grid')}
                title="그리드 타일형 보기"
                className={`p-1 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
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

        {/* 검색창 컴포넌트 */}
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="시간 때우기 콘텐츠 검색..."
        />
      </div>

      {/* 메뉴 리스트 / 그리드 */}
      <div className="min-h-[240px]">
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
        ) : viewMode === 'list' ? (
          /* [리스트 뷰] 좌측 컬러 아이콘 + 중앙 정보 + 우측 재생 버튼 */
          <div className="space-y-1.5">
            {paginatedContents.map((item) => {
              const isSelected = item.id === selectedContentId;
              const categoryName =
                categories.find((c) => c.id === item.categoryId)?.name || '';
              const iconCfg = getContentIconConfig(item.title, item.vercelUrl);
              const IconComp = iconCfg.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectContent(item)}
                  className={`group flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/50 border-sky-500 shadow-sm shadow-sky-950/50'
                      : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    {/* 게임 전용 컬러 SVG 아이콘 배지 */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-all ${iconCfg.bgClass} ${iconCfg.borderClass}`}
                    >
                      <IconComp className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${iconCfg.textClass}`} />
                    </div>

                    {/* 타이틀 및 설명 */}
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[12px] text-slate-100 truncate group-hover:text-white">
                          {item.title}
                        </span>
                        {categoryName && (
                          <span className="text-[10px] text-slate-400 bg-slate-800/90 px-1.5 py-0.2 rounded shrink-0 border border-slate-700/60">
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
                  </div>

                  <div className="shrink-0 flex items-center">
                    <span
                      className={`p-1.5 rounded-full transition-all ${
                        isSelected
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'bg-slate-800/80 text-slate-400 group-hover:bg-sky-900 group-hover:text-sky-300'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* [그리드 뷰] 2열 사각 비주얼 카드 */
          <div className="grid grid-cols-2 gap-2">
            {paginatedContents.map((item) => {
              const isSelected = item.id === selectedContentId;
              const categoryName =
                categories.find((c) => c.id === item.categoryId)?.name || '';
              const iconCfg = getContentIconConfig(item.title, item.vercelUrl);
              const IconComp = iconCfg.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectContent(item)}
                  className={`group relative flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500 shadow-md shadow-sky-950/60 ring-1 ring-sky-500/40'
                      : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* 상단 전용 SVG 아이콘 */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border mb-2 transition-all ${iconCfg.bgClass} ${iconCfg.borderClass}`}
                  >
                    <IconComp className={`w-5 h-5 transition-transform group-hover:scale-115 ${iconCfg.textClass}`} />
                  </div>

                  {/* 제목 */}
                  <span className="font-semibold text-[12px] text-slate-100 truncate w-full group-hover:text-white">
                    {item.title}
                  </span>

                  {/* 카테고리 태그 */}
                  {categoryName && (
                    <span className="mt-1 text-[10px] text-slate-400 bg-slate-800/90 px-1.5 py-0.2 rounded border border-slate-700/60 truncate max-w-full">
                      {categoryName}
                    </span>
                  )}

                  {/* 선택 표시 뱃지 */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 페이지네이션 (5개 블록 레이아웃) */}
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
