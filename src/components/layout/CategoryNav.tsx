'use client';

import React from 'react';
import { Category } from '@/types';
import { Plus } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isAdmin,
  onOpenAdmin,
}) => {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 py-2">
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs font-semibold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-sky-950/70 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors ml-2"
            title="카테고리 추가/편집"
          >
            <Plus className="w-3 h-3 text-sky-300" />
            <span>카테고리 편집</span>
          </button>
        )}
      </div>
    </div>
  );
};
