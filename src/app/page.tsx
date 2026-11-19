'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  isAdminUserSession,
} from '@/utils/analytics';
import { useAuth } from '@/context/AuthContext';
import { getGameKey } from '@/games';

export default function HomePage() {
  const { isAdmin, isAuthLoading } = useAuth();

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

  // 현재 재생 중인 콘텐츠 체류 시간 측정을 위한 Ref 및 관리자 상태 Ref
  const activeContentRef = useRef<{ id: string; startTime: number } | null>(null);
  const isAdminRef = useRef<boolean>(isAdmin);
  const siteVisitTrackedRef = useRef<boolean>(false);

  // 관리자 상태 동기화 (로그인 즉시 체류 타이머 파기하여 통계 미반영)
  useEffect(() => {
    isAdminRef.current = isAdmin;
    if (isAdmin) {
      activeContentRef.current = null;
    }
  }, [isAdmin]);

  // 1. 초기 로컬 캐시 로드 및 Firestore 구독
  useEffect(() => {

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

  // 2-1. 인증 상태 확인 완료 후 사이트 전체 방문(PV/UV) 추적 (관리자는 완전 제외)
  useEffect(() => {
    if (isAuthLoading || siteVisitTrackedRef.current) return;
    siteVisitTrackedRef.current = true;
    if (!isAdmin && !isAdminUserSession()) {
      trackSiteVisit();
    }
  }, [isAuthLoading, isAdmin]);

  // 3. 사용자가 게임을 직접 클릭하여 시작했을 때만 방문(PV/UV) 및 실제 활성 머문 시간 추적 (관리자 제외 + 백그라운드/유휴 시간 차단 + 중복 전송 방지)
  useEffect(() => {
    if (!selectedContent || isAuthLoading) return;

    // 관리자로 로그인된 상태이거나 세션이 관리자면 모든 콘텐츠 통계 추적 중단
    if (isAdmin || isAdminUserSession()) {
      activeContentRef.current = null;
      return;
    }

    const contentId = selectedContent.id;

    // A. 새 콘텐츠 접속 기록 (PV / UV)
    trackContentView(selectedContent);

    // B. 실제 활성 체류 시간(Active Dwell Time) 1초 단위 측정 + 3초 주기 실시간 동기화
    let unflushedSeconds = 0;
    let totalSessionSeconds = 0;
    let lastInteractionTime = Date.now();

    const updateInteraction = () => {
      lastInteractionTime = Date.now();
    };

    const flushActiveDwell = () => {
      if (isAdminRef.current || isAdminUserSession() || unflushedSeconds <= 0) return;
      const toSend = unflushedSeconds;
      unflushedSeconds = 0;
      trackContentDwellTime(contentId, toSend);
    };

    const tickInterval = window.setInterval(() => {
      if (isAdminRef.current || isAdminUserSession()) return;
      const isVisible = document.visibilityState === 'visible';
      const isRecentlyActive = Date.now() - lastInteractionTime < 60000;
      if (isVisible && isRecentlyActive && totalSessionSeconds < 600) {
        unflushedSeconds += 1;
        totalSessionSeconds += 1;
        // 3초마다 실시간으로 Firestore에 반영하여 창을 갑자기 닫아도 체류 시간이 유실되지 않게 보장
        if (unflushedSeconds >= 3) {
          flushActiveDwell();
        }
      }
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushActiveDwell();
      } else {
        lastInteractionTime = Date.now();
      }
    };

    window.addEventListener('pointerdown', updateInteraction, { passive: true });
    window.addEventListener('pointermove', updateInteraction, { passive: true });
    window.addEventListener('keydown', updateInteraction, { passive: true });
    window.addEventListener('scroll', updateInteraction, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', flushActiveDwell);
    window.addEventListener('beforeunload', flushActiveDwell);

    return () => {
      window.clearInterval(tickInterval);
      window.removeEventListener('pointerdown', updateInteraction);
      window.removeEventListener('pointermove', updateInteraction);
      window.removeEventListener('keydown', updateInteraction);
      window.removeEventListener('scroll', updateInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', flushActiveDwell);
      window.removeEventListener('beforeunload', flushActiveDwell);
      flushActiveDwell();
    };
  }, [selectedContent?.id, isAdmin, isAuthLoading]);

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

      {/* 고신뢰성 정식 푸터 (구글 애드센스 정책 준수) */}
      <footer className="w-full bg-slate-950/95 border-t border-slate-800/80 py-8 text-slate-400 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
              <span className="font-extrabold text-white text-base tracking-tight">With Sinabro</span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="text-xs text-slate-400">스마트하게 즐기는 무료 웹 미니게임 & 유틸리티</span>
            </div>
            {/* 정책 및 신뢰성 네비게이션 */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
              <Link href="/about" className="hover:text-white transition-colors">
                사이트 소개
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/privacy" className="hover:text-sky-300 text-sky-400 font-semibold transition-colors">
                개인정보처리방침
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                서비스 이용약관
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/contact" className="hover:text-white transition-colors">
                문의 및 피드백
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
            <p>
              본 웹사이트의 모든 콘텐츠는 무료로 이용 가능하며, 공정한 오락 및 편의를 위해 제공됩니다.
            </p>
            <p>© With Sinabro. All rights reserved. • Contact: support@ws.ai.kr</p>
          </div>
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
