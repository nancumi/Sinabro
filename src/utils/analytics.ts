import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';
import { ContentItem, DailyAnalytics, ContentAnalytics } from '@/types';

const ANALYTICS_COLLECTION = 'analytics_daily';
const VID_KEY = 'sinabro_vid_v1';
const LAST_UV_DATE_KEY = 'sinabro_last_uv_date';

// 로컬 기준 'YYYY-MM-DD' 문자열 생성 (오프셋 일수 지원)
export const getTodayString = (offsetDays: number = 0): string => {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 특정 Date 객체를 'YYYY-MM-DD'로 변환
export const formatDateToYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 고유 방문자 ID 가져오기 (없으면 자동 생성)
export const getOrCreateVisitorId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let vid = localStorage.getItem(VID_KEY);
  if (!vid) {
    vid = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(VID_KEY, vid);
  }
  return vid;
};

// 디바이스 타입 판별
export const detectDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  const isTablet = /iPad|Tablet/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isTablet) return 'tablet';
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  return isMobile ? 'mobile' : 'desktop';
};

/**
 * 1. 사이트 전체 접속(PV / UV) 기록
 */
export const trackSiteVisit = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    const today = getTodayString();
    getOrCreateVisitorId();

    // 일별 순수 방문자(UV) 여부 판별
    const lastUvDate = localStorage.getItem(LAST_UV_DATE_KEY);
    const isNewDailyUv = lastUvDate !== today;
    if (isNewDailyUv) {
      localStorage.setItem(LAST_UV_DATE_KEY, today);
    }

    // 세션별 중복 방문(PV) 기록
    const sessionKey = `sinabro_pv_${today}`;
    sessionStorage.setItem(sessionKey, '1');

    const device = detectDeviceType();
    const hour = String(new Date().getHours());

    const docRef = doc(db, ANALYTICS_COLLECTION, today);

    await setDoc(
      docRef,
      {
        date: today,
        totalPv: increment(1),
        ...(isNewDailyUv ? { totalUv: increment(1) } : {}),
        deviceStats: {
          [device]: increment(1),
        },
        hourlyPv: {
          [hour]: increment(1),
        },
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to track site visit:', err);
  }
};

/**
 * 2. 개별 콘텐츠/게임 접속(PV / UV) 기록
 */
export const trackContentView = async (content: ContentItem): Promise<void> => {
  if (typeof window === 'undefined' || !content?.id) return;

  try {
    const today = getTodayString();
    const contentUvKey = `sinabro_content_uv_${today}_${content.id}`;
    const isNewContentUv = !sessionStorage.getItem(contentUvKey);

    if (isNewContentUv) {
      sessionStorage.setItem(contentUvKey, '1');
    }

    const docRef = doc(db, ANALYTICS_COLLECTION, today);

    await setDoc(
      docRef,
      {
        date: today,
        contents: {
          [content.id]: {
            id: content.id,
            title: content.title,
            pv: increment(1),
            ...(isNewContentUv ? { uv: increment(1) } : {}),
            totalDwellSeconds: increment(0),
          },
        },
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error(`Failed to track content view for ${content.title}:`, err);
  }
};

/**
 * 3. 개별 콘텐츠 체류 시간(머문 시간) 기록 (초 단위)
 */
export const trackContentDwellTime = async (contentId: string, seconds: number): Promise<void> => {
  if (typeof window === 'undefined' || !contentId || seconds <= 0) return;

  // 비정상적인 장기 유휴 시간(4시간 초과) 방지
  const safeSeconds = Math.min(seconds, 14400);

  try {
    const today = getTodayString();
    const docRef = doc(db, ANALYTICS_COLLECTION, today);

    await setDoc(
      docRef,
      {
        contents: {
          [contentId]: {
            totalDwellSeconds: increment(safeSeconds),
          },
        },
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error(`Failed to track dwell time for ${contentId}:`, err);
  }
};

/**
 * 4. 특정 일자 통계 데이터 조회 (단일 날짜)
 */
export const fetchDailyAnalytics = async (dateStr: string): Promise<DailyAnalytics | null> => {
  try {
    const docRef = doc(db, ANALYTICS_COLLECTION, dateStr);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as DailyAnalytics;
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch analytics for ${dateStr}:`, err);
    return null;
  }
};

/**
 * 5. 시작일~종료일 기간별 통계 데이터 조회 (범위 조회)
 */
export const fetchDateRangeAnalytics = async (
  startDate: string,
  endDate: string
): Promise<DailyAnalytics[]> => {
  try {
    const q = query(
      collection(db, ANALYTICS_COLLECTION),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    const snap = await getDocs(q);
    const list: DailyAnalytics[] = [];
    snap.forEach((d) => {
      list.push(d.data() as DailyAnalytics);
    });
    return list;
  } catch (err) {
    console.error(`Failed to fetch date range analytics (${startDate} ~ ${endDate}):`, err);
    return [];
  }
};
