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

export interface ContentAnalytics {
  id: string;
  title: string;
  pv: number;               // 중복 방문 수 (Page Views)
  uv: number;               // 순수 방문자 수 (Unique Visitors)
  totalDwellSeconds: number; // 총 체류 시간 (초 단위)
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
