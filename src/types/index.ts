export interface ContentItem {
  id: string;
  categoryId: string;
  title: string;
  description?: string;
  vercelUrl: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface AdConfig {
  topBannerEnabled: boolean;
  sideBannerEnabled: boolean;
  bottomBannerEnabled: boolean;
  adsenseClientId: string;
  topSlotId: string;
  sideSlotId: string;
  bottomSlotId: string;
}

export interface ContentVisitorDetail {
  visitorId: string;
  device?: 'mobile' | 'desktop' | 'tablet';
  visits: number;            // 해당 방문자의 방문 횟수 (PV)
  dwellSeconds: number;      // 해당 방문자의 체류 시간 (초 단위)
  lastVisitedAt?: number;    // 마지막 방문 시각 (timestamp)
  date?: string;             // 방문 일자 ('YYYY-MM-DD')
}

export interface ContentAnalytics {
  id: string;
  title: string;
  pv: number;               // 중복 방문 수 (Page Views)
  uv: number;               // 순수 방문자 수 (Unique Visitors)
  totalDwellSeconds: number; // 총 체류 시간 (초 단위)
  visitors?: Record<string, ContentVisitorDetail>; // 방문자별 세부 내역
}

export interface DailyAnalytics {
  date: string;              // 'YYYY-MM-DD'
  totalPv: number;           // 전체 중복 방문 접속자 수
  totalUv: number;           // 전체 순수 접속자 수
  deviceStats?: {
    mobile?: number;
    desktop?: number;
    tablet?: number;
  };
  hourlyPv?: Record<string, number>; // '0' ~ '23'
  contents?: Record<string, ContentAnalytics>;
  updatedAt: number;
}
