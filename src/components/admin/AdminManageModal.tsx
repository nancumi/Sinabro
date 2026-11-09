'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { Category, ContentItem } from '@/types';
import { Trash2, Plus, Edit2, Link as LinkIcon, FolderPlus } from 'lucide-react';
import { useAppModal } from '@/context/ModalContext';

interface AdminManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  contents: ContentItem[];
  onSaveCategories: (categories: Category[]) => void;
  onSaveContents: (contents: ContentItem[]) => void;
}

export const AdminManageModal: React.FC<AdminManageModalProps> = ({
  isOpen,
  onClose,
  categories,
  contents,
  onSaveCategories,
  onSaveContents,
}) => {
  const { showConfirm, showAlert } = useAppModal();
  const [activeTab, setActiveTab] = useState<'category' | 'content'>('category');

  // 카테고리 폼
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // 콘텐츠 메뉴 폼
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[1]?.id || categories[0]?.id || '');
  const [contentTitle, setContentTitle] = useState('');
  const [contentVercelUrl, setContentVercelUrl] = useState('');
  const [contentDesc, setContentDesc] = useState('');
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  // 콘텐츠 목록 카테고리 필터 및 페이지네이션 (3개 단위)
  const [selectedFilterCatId, setSelectedFilterCatId] = useState<string>('cat-all');
  const [contentPage, setContentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 3;

  const filteredContents = useMemo(() => {
    if (selectedFilterCatId === 'cat-all') {
      return contents;
    }
    return contents.filter((item) => item.categoryId === selectedFilterCatId);
  }, [contents, selectedFilterCatId]);

  const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);

  const paginatedContents = useMemo(() => {
    const start = (contentPage - 1) * ITEMS_PER_PAGE;
    return filteredContents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContents, contentPage]);

  useEffect(() => {
    if (contentPage > totalPages && totalPages > 0) {
      setContentPage(totalPages);
    }
  }, [totalPages, contentPage]);

  // --- 카테고리 관련 핸들러 ---
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      showAlert('카테고리 이름을 입력해 주세요.');
      return;
    }
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      order: categories.length + 1,
    };
    onSaveCategories([...categories, newCat]);
    setNewCategoryName('');
  };

  const handleUpdateCategory = (id: string) => {
    if (!editCategoryName.trim()) {
      showAlert('수정할 카테고리 이름을 입력해 주세요.');
      return;
    }
    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, name: editCategoryName.trim() } : cat
    );
    onSaveCategories(updated);
    setEditingCategoryId(null);
    setEditCategoryName('');
  };

  const handleDeleteCategory = (cat: Category) => {
    if (cat.id === 'cat-all') {
      showAlert('기본 "전체" 카테고리는 삭제할 수 없습니다.');
      return;
    }
    showConfirm({
      title: '카테고리 삭제',
      message: `"${cat.name}" 카테고리를 삭제하시겠습니까?\n소속된 콘텐츠들도 함께 정리됩니다.`,
      onConfirm: () => {
        onSaveCategories(categories.filter((c) => c.id !== cat.id));
        onSaveContents(contents.filter((item) => item.categoryId !== cat.id));
      },
    });
  };

  // --- 콘텐츠 관련 핸들러 ---
  const handleSaveContent = () => {
    if (!contentTitle.trim()) {
      showAlert('콘텐츠 이름을 입력해 주세요.');
      return;
    }

    if (editingContentId) {
      const updated = contents.map((item) =>
        item.id === editingContentId
          ? {
              ...item,
              categoryId: selectedCatId,
              title: contentTitle.trim(),
              vercelUrl: contentVercelUrl.trim(),
              description: contentDesc.trim(),
            }
          : item
      );
      onSaveContents(updated);
      setEditingContentId(null);
    } else {
      const newContent: ContentItem = {
        id: `content-${Date.now()}`,
        categoryId: selectedCatId,
        title: contentTitle.trim(),
        vercelUrl: contentVercelUrl.trim(),
        description: contentDesc.trim(),
      };
      onSaveContents([...contents, newContent]);
    }

    setContentTitle('');
    setContentVercelUrl('');
    setContentDesc('');
  };

  const handleEditContentClick = (item: ContentItem) => {
    setEditingContentId(item.id);
    setSelectedCatId(item.categoryId);
    setContentTitle(item.title);
    setContentVercelUrl(item.vercelUrl);
    setContentDesc(item.description || '');
  };

  const handleCancelEditContent = () => {
    setEditingContentId(null);
    setContentTitle('');
    setContentVercelUrl('');
    setContentDesc('');
  };

  const handleDeleteContent = (item: ContentItem) => {
    showConfirm({
      title: '콘텐츠 삭제',
      message: `"${item.title}" 콘텐츠를 삭제하시겠습니까?`,
      onConfirm: () => {
        onSaveContents(contents.filter((c) => c.id !== item.id));
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="관리자 설정 (카테고리 및 콘텐츠 관리)"
      maxWidth="max-w-2xl"
      topOffset="pt-6 md:pt-[80px] lg:pt-[100px]"
    >
      <div className="space-y-4 text-[12px]">
        {/* 상단 탭 */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('category')}
            className={`pb-2 px-3 text-[12px] font-medium border-b-2 transition-colors ${
              activeTab === 'category'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            카테고리 관리 ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`pb-2 px-3 text-[12px] font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            콘텐츠 및 Vercel URL 관리 ({contents.length})
          </button>
        </div>

        {/* 카테고리 탭 */}
        {activeTab === 'category' && (
          <div className="space-y-4">
            <div className="flex gap-2 items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="새 카테고리 이름 입력..."
                className="flex-1 px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5 text-sky-300" />
                카테고리 추가
              </button>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800 max-h-[40vh] overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-2.5 hover:bg-slate-800/40">
                  {editingCategoryId === cat.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="flex-1 px-2 py-1 text-[12px] bg-slate-950 border border-sky-500 rounded text-slate-100 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateCategory(cat.id)}
                        className="px-2 py-1 rounded text-[11px] bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategoryId(null)}
                        className="px-2 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200 text-[12px]">{cat.name}</span>
                      <span className="text-[11px] font-medium text-sky-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                        (
                        {cat.id === 'cat-all'
                          ? contents.length
                          : contents.filter((c) => c.categoryId === cat.id).length}
                        )
                      </span>
                      {cat.id === 'cat-all' && (
                        <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          기본
                        </span>
                      )}
                    </div>
                  )}

                  {editingCategoryId !== cat.id && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setEditCategoryName(cat.name);
                        }}
                        className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        title="이름 수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {cat.id !== 'cat-all' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-950/50 hover:text-rose-300"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 콘텐츠 및 Vercel URL 관리 탭 */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-semibold text-slate-300">
                {editingContentId ? '콘텐츠 정보 수정' : '새 Vercel 콘텐츠 등록'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">카테고리 선택</label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {categories
                      .filter((c) => c.id !== 'cat-all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">콘텐츠 이름</label>
                  <input
                    type="text"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    placeholder="예: 반응속도 테스트, 미니 계산기"
                    className="w-full px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-sky-400" />
                  실행될 Vercel 주소 (URL)
                </label>
                <input
                  type="text"
                  value={contentVercelUrl}
                  onChange={(e) => setContentVercelUrl(e.target.value)}
                  placeholder="https://my-content.vercel.app"
                  className="w-full px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  * 다른 작업폴더에서 제작하여 Vercel에 배포한 주소를 입력하면 해당 영역에 즉시 실행됩니다.
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">설명 (선택)</label>
                <input
                  type="text"
                  value={contentDesc}
                  onChange={(e) => setContentDesc(e.target.value)}
                  placeholder="간단한 시간 때우기 콘텐츠 설명"
                  className="w-full px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {editingContentId && (
                  <button
                    type="button"
                    onClick={handleCancelEditContent}
                    className="px-3 py-1.5 rounded-md text-[12px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    수정 취소
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveContent}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-sky-300" />
                  {editingContentId ? '콘텐츠 저장' : '새 콘텐츠 등록'}
                </button>
              </div>
            </div>

            {/* 카테고리별 분류 필터 바 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {categories.map((cat) => {
                const count =
                  cat.id === 'cat-all'
                    ? contents.length
                    : contents.filter((c) => c.categoryId === cat.id).length;
                const isSelected = selectedFilterCatId === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedFilterCatId(cat.id);
                      setContentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors border ${
                      isSelected
                        ? 'bg-sky-950 text-sky-200 border-sky-600 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* 등록된 콘텐츠 목록 (3개씩 표시, 높이 고정으로 덜컹거림 방지) */}
            <div className="border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800 bg-slate-900/40 min-h-[162px]">
              {filteredContents.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-[12px]">
                  {selectedFilterCatId === 'cat-all'
                    ? '등록된 콘텐츠가 없습니다. 위 입력창에서 제작하신 Vercel 주소를 등록해 보세요.'
                    : '해당 카테고리에 등록된 콘텐츠가 없습니다.'}
                </div>
              ) : (
                paginatedContents.map((item) => {
                  const catName = categories.find((c) => c.id === item.categoryId)?.name || '미지정';
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2.5 hover:bg-slate-800/40">
                      <div className="space-y-0.5 flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800/60 shrink-0">
                            {catName}
                          </span>
                          <span className="font-semibold text-slate-200 text-[12px] truncate">
                            {item.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {item.vercelUrl ? (
                            <span className="text-slate-300 font-mono">{item.vercelUrl}</span>
                          ) : (
                            <span className="text-amber-400 italic">Vercel URL 미등록 (설정 필요)</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditContentClick(item)}
                          className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                          title="수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContent(item)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-950/50 hover:text-rose-300"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 페이지네이션 (5개 단위 블록, << < 1 2 3 4 5 > >>) */}
            <div className="h-9 flex items-center justify-center pt-1">
              {totalPages > 1 && (
                <Pagination
                  currentPage={contentPage}
                  totalPages={totalPages}
                  onPageChange={setContentPage}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
