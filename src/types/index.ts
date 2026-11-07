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
