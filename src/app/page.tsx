'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { ContentViewer } from '@/components/content/ContentViewer';
import { ContentMenuList } from '@/components/content/ContentMenuList';
import { AdSlot } from '@/components/ads/AdSlot';
import { AdminManageModal } from '@/components/admin/AdminManageModal';
import { AdConfigModal } from '@/components/admin/AdConfigModal';
import { AnalyticsModal } from '@/components/admin/AnalyticsModal';
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
import {
  trackSiteVisit,
  trackContentView,
  trackContentDwellTime,
} from '@/utils/analytics';
import { useAuth } from '@/context/AuthContext';
import { getGameKey } from '@/games';

export default function HomePage() {
  const { isAdmin } = useAuth();

  // 상태 관리 (초기 카테고리 및 콘텐츠는 미선택 상태로 시작)
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [adConfig, setAdConfig] = useState<AdConfig>({
    topBannerEnabled: true,
    sideBannerEnabled: true,
    bottomBannerEnabled: true,
    adsenseClientId: 'ca-pub-4819204726523615',
    topSlotId: '',
    sideSlotId: '',
    bottomSlotId: '',
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // 모달 제어 상태
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdConfigModalOpen, setIsAdConfigModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  // 현재 재생 중인 콘텐츠 체류 시간 측정을 위한 Ref
  const activeContentRef = useRef<{ id: string; startTime: number } | null>(null);

  // 1. 초기 로컬 캐시 로드 및 사이트 전체 방문(PV/UV) 추적
  useEffect(() => {
    // 사이트 전체 접속 추적
    trackSiteVisit();

    const localCats = loadLocalCategories();
    const localContents = loadLocalContents();
    const localAds = loadLocalAdConfig();

    setCategories(localCats);
    setContents(localContents);
    setAdConfig(localAds);

    // URL 파라미터(?game=... 또는 ?title=...)로 직접 진입한 경우에만 자동 선택
    const findMatched = (items: ContentItem[]) => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const rawQuery = (params.get('game') || params.get('title') || '').trim();
        if (rawQuery) {
          const query = rawQuery.toLowerCase();
          // A. query 자체를 getGameKey로 변환 (예: 'touch' -> 'finger-touch', 'mole' -> 'mole-whack', '2048' -> 'number-merge' 등)
          const targetKey = getGameKey(query, query);

          // 1. getGameKey 일치 매칭 (타겟 키 일치 또는 키 포함 관계)
          const matchedByKey = items.find((c) => {
            const key = getGameKey(c.title, c.vercelUrl);
            if (!key) return false;
            if (targetKey && key === targetKey) return true;
            const k = key.toLowerCase();
            return k === query || k.includes(query) || query.includes(k);
          });
          if (matchedByKey) return matchedByKey;

          // 2. 제목(title) 또는 vercelUrl 부분 일치
          const cleanQuery = query.replace(/\s+/g, '');
          const matchedByTitleOrUrl = items.find((c) => {
            const cleanTitle = c.title.toLowerCase().replace(/\s+/g, '');
            const cleanUrl = (c.vercelUrl || '').toLowerCase().replace(/\s+/g, '');
            return (
              cleanTitle.includes(cleanQuery) ||
              cleanQuery.includes(cleanTitle) ||
              cleanUrl.includes(cleanQuery)
            );
          });
          if (matchedByTitleOrUrl) return matchedByTitleOrUrl;

          // 3. ID 직접 일치
          const matchedById = items.find((c) => c.id === rawQuery || c.id === query);
          if (matchedById) return matchedById;
        }
      }
      return null;
    };

    if (localContents.length > 0) {
      const matched = findMatched(localContents);
      if (matched) {
        setSelectedContent(matched);
      }
    }

    // 2. Firestore 실시간 동기화 구독
    const unsubscribe = subscribeToSiteData((data) => {
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
      if (data.contents) {
        setContents(data.contents);
        setSelectedContent((prev) => {
          if (!prev) return findMatched(data.contents);
          const found = data.contents.find((c) => c.id === prev.id);
          return found || null;
        });
      }
      if (data.adConfig) {
        setAdConfig(data.adConfig);
      }
    });

    return () => unsubscribe();
  }, []);

  // 3. 사용자가 게임을 직접 클릭하여 시작했을 때만 방문(PV/UV) 및 머문 시간 추적
  useEffect(() => {
    if (!selectedContent) return;

    // A. 이전 콘텐츠 체류 시간 정산
    if (activeContentRef.current) {
      const prevId = activeContentRef.current.id;
      const elapsed = Math.round((Date.now() - activeContentRef.current.startTime) / 1000);
      if (elapsed > 0) {
        trackContentDwellTime(prevId, elapsed);
      }
    }

    // B. 새 콘텐츠 접속 기록 (PV / UV)
    trackContentView(selectedContent);

    // C. 새 타이머 시작
    activeContentRef.current = {
      id: selectedContent.id,
      startTime: Date.now(),
    };

    // D. 창 닫기 / 새로고침 시 최종 체류 시간 전송
    const handleBeforeUnload = () => {
      if (activeContentRef.current) {
        const elapsed = Math.round((Date.now() - activeContentRef.current.startTime) / 1000);
        if (elapsed > 0) {
          trackContentDwellTime(activeContentRef.current.id, elapsed);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (activeContentRef.current && activeContentRef.current.id === selectedContent.id) {
        const elapsed = Math.round((Date.now() - activeContentRef.current.startTime) / 1000);
        if (elapsed > 0) {
          trackContentDwellTime(activeContentRef.current.id, elapsed);
        }
      }
    };
  }, [selectedContent?.id]);

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
      setSelectedContent(updatedCurrent || null);
    }
  };

  // 광고 설정 변경 처리 (Firestore + LocalStorage)
  const handleSaveAdConfig = async (newConfig: AdConfig) => {
    setAdConfig(newConfig);
    await saveAdConfig(newConfig);
  };

  // 콘텐츠 선택 시 뷰어 영역 최상단으로 부드럽게 스크롤
  const handleSelectContent = (item: ContentItem) => {
    setSelectedContent(item);

    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* 글로벌 상단 헤더 */}
      <Header
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenAdConfig={() => setIsAdConfigModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
      />

      {/* 카테고리 탭 네비게이션 */}
      <CategoryNav
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(id) => setSelectedCategoryId(id)}
        contents={contents}
        selectedContentId={selectedContent?.id || null}
        onSelectContent={handleSelectContent}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 상단 배너 광고 슬롯 */}
      {(adConfig.topBannerEnabled && ((adConfig.adsenseClientId && adConfig.topSlotId) || isAdmin)) && (
        <div className="max-w-7xl mx-auto w-full px-4 pt-3">
          <AdSlot type="top" adConfig={adConfig} />
        </div>
      )}

      {/* 메인 콘텐츠 영역 (반응형: 웹, 태블릿, 모바일) */}
      <main className="max-w-7xl mx-auto w-full px-4 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* 중앙/좌측 콘텐츠 뷰어 (웹 8컬럼, 모바일 12컬럼) */}
          <div id="game-viewer-section" className="lg:col-span-8 xl:col-span-8 space-y-4">
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

      {/* 관리자 실시간 방문자 접속 통계 및 분석 모달창 */}
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
    </div>
  );
}
