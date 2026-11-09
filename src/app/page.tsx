'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { ContentViewer } from '@/components/content/ContentViewer';
import { ContentMenuList } from '@/components/content/ContentMenuList';
import { AdSlot } from '@/components/ads/AdSlot';
import { AdminManageModal } from '@/components/admin/AdminManageModal';
import { AdConfigModal } from '@/components/admin/AdConfigModal';
import { Category, ContentItem, AdConfig } from '@/types';
import {
  loadLocalCategories,
  loadLocalContents,
  loadLocalAdConfig,
  subscribeToSiteData,
  saveCategories,
  saveContents,
  saveAdConfig,
} from '@/utils/storage';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isAdmin } = useAuth();

  // 상태 관리
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [adConfig, setAdConfig] = useState<AdConfig>({
    topBannerEnabled: true,
    sideBannerEnabled: true,
    bottomBannerEnabled: true,
    adsenseClientId: '',
    topSlotId: '',
    sideSlotId: '',
    bottomSlotId: '',
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-all');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // 모달 제어 상태
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdConfigModalOpen, setIsAdConfigModalOpen] = useState(false);

  // 1. 초기 로컬 캐시 로드
  useEffect(() => {
    const localCats = loadLocalCategories();
    const localContents = loadLocalContents();
    const localAds = loadLocalAdConfig();

    setCategories(localCats);
    setContents(localContents);
    setAdConfig(localAds);

    const findMatched = (items: ContentItem[]) => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const titleQuery = params.get('title') || params.get('game');
        if (titleQuery) {
          const found = items.find((c) => c.title.toLowerCase().includes(titleQuery.toLowerCase()));
          if (found) return found;
        }
      }
      return items[0] || null;
    };

    if (localContents.length > 0) {
      setSelectedContent(findMatched(localContents));
    }

    // 2. Firestore 실시간 동기화 구독 (클라우드 DB에 데이터 있을 시 자동 갱신)
    const unsubscribe = subscribeToSiteData((data) => {
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
      if (data.contents) {
        setContents(data.contents);
        setSelectedContent((prev) => {
          if (!prev) return findMatched(data.contents);
          const found = data.contents.find((c) => c.id === prev.id);
          return found || findMatched(data.contents);
        });
      }
      if (data.adConfig) {
        setAdConfig(data.adConfig);
      }
    });

    return () => unsubscribe();
  }, []);

  // 카테고리 변경 처리 (Firestore + LocalStorage)
  const handleSaveCategories = async (newCats: Category[]) => {
    setCategories(newCats);
    await saveCategories(newCats);
  };

  // 콘텐츠 목록 변경 처리 (Firestore + LocalStorage)
  const handleSaveContents = async (newContents: ContentItem[]) => {
    setContents(newContents);
    await saveContents(newContents);
    if (selectedContent) {
      const updatedCurrent = newContents.find((item) => item.id === selectedContent.id);
      if (updatedCurrent) {
        setSelectedContent(updatedCurrent);
      } else if (newContents.length > 0) {
        setSelectedContent(newContents[0]);
      } else {
        setSelectedContent(null);
      }
    } else if (newContents.length > 0) {
      setSelectedContent(newContents[0]);
    }
  };

  // 광고 설정 변경 처리 (Firestore + LocalStorage)
  const handleSaveAdConfig = async (newAdConfig: AdConfig) => {
    setAdConfig(newAdConfig);
    await saveAdConfig(newAdConfig);
  };

  // 콘텐츠 선택 시 URL 파라미터 자동 갱신 (?title=...)
  const handleSelectContent = (item: ContentItem) => {
    setSelectedContent(item);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('title', item.title);
      window.history.replaceState(null, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 text-[12px]">
      {/* 헤더 */}
      <Header
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenAdConfig={() => setIsAdConfigModalOpen(true)}
      />

      {/* 카테고리 네비게이션 탭 */}
      <CategoryNav
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 상단 광고 슬롯 */}
      {(adConfig.topBannerEnabled && ((adConfig.adsenseClientId && adConfig.topSlotId) || isAdmin)) && (
        <div className="max-w-7xl mx-auto w-full px-4 pt-3">
          <AdSlot type="top" adConfig={adConfig} />
        </div>
      )}

      {/* 메인 콘텐츠 영역 (반응형: 웹, 태블릿, 모바일) */}
      <main className="max-w-7xl mx-auto w-full px-4 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* 중앙/좌측 콘텐츠 뷰어 (웹 8컬럼, 모바일 12컬럼) */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-4">
            <ContentViewer
              content={selectedContent}
              isAdmin={isAdmin}
              onOpenAdmin={() => setIsAdminModalOpen(true)}
            />

            {/* 태블릿/모바일에서는 뷰어 바로 아래에 메뉴 리스트 배치 */}
            <div className="lg:hidden">
              <ContentMenuList
                contents={contents}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                selectedContentId={selectedContent?.id || null}
                onSelectContent={handleSelectContent}
                isAdmin={isAdmin}
                onOpenAdmin={() => setIsAdminModalOpen(true)}
              />
            </div>
          </div>

          {/* 우측 사이드 영역 (웹 전용: 메뉴 리스트 & 구글 애즈 사이드 배너) */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 flex-col gap-4">
            <ContentMenuList
              contents={contents}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              selectedContentId={selectedContent?.id || null}
              onSelectContent={handleSelectContent}
              isAdmin={isAdmin}
              onOpenAdmin={() => setIsAdminModalOpen(true)}
            />

            <AdSlot type="side" adConfig={adConfig} />
          </div>
        </div>
      </main>

      {/* 하단 광고 슬롯 */}
      {(adConfig.bottomBannerEnabled && ((adConfig.adsenseClientId && adConfig.bottomSlotId) || isAdmin)) && (
        <div className="max-w-7xl mx-auto w-full px-4 pb-4">
          <AdSlot type="bottom" adConfig={adConfig} />
        </div>
      )}

      {/* 푸터 */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-4 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <span>© Sinabro. All rights reserved.</span>
        </div>
      </footer>

      {/* 관리자 모달창 (카테고리 및 Vercel 콘텐츠 URL 관리) */}
      <AdminManageModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        categories={categories}
        contents={contents}
        onSaveCategories={handleSaveCategories}
        onSaveContents={handleSaveContents}
      />

      {/* 관리자 구글 애즈 설정 모달창 */}
      <AdConfigModal
        isOpen={isAdConfigModalOpen}
        onClose={() => setIsAdConfigModalOpen(false)}
        adConfig={adConfig}
        onSave={handleSaveAdConfig}
      />
    </div>
  );
}
