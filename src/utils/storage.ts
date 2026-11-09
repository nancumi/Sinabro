import { Category, ContentItem, AdConfig } from '@/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', name: '전체', order: 1 },
  { id: 'cat-fun', name: '미니게임', order: 2 },
  { id: 'cat-util', name: '유용한 도구', order: 3 },
  { id: 'cat-relax', name: '힐링/시간때우기', order: 4 },
];

export const INITIAL_CONTENTS: ContentItem[] = [];

export const INITIAL_AD_CONFIG: AdConfig = {
  topBannerEnabled: true,
  sideBannerEnabled: true,
  bottomBannerEnabled: true,
  adsenseClientId: 'ca-pub-4819204726523615',
  topSlotId: '',
  sideSlotId: '',
  bottomSlotId: '',
};

const CATEGORIES_KEY = 'sinabro_categories_v2';
const CONTENTS_KEY = 'sinabro_contents_v2';
const AD_CONFIG_KEY = 'sinabro_ad_config_v2';

const SITE_DATA_COLLECTION = 'site_data';
const SITE_DATA_DOC = 'main';

// 로컬 스토리지 헬퍼
export const loadLocalCategories = (): Category[] => {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (!stored) return INITIAL_CATEGORIES;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CATEGORIES;
  }
};

export const loadLocalContents = (): ContentItem[] => {
  if (typeof window === 'undefined') return INITIAL_CONTENTS;
  const stored = localStorage.getItem(CONTENTS_KEY);
  if (!stored) return INITIAL_CONTENTS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CONTENTS;
  }
};

export const loadLocalAdConfig = (): AdConfig => {
  if (typeof window === 'undefined') return INITIAL_AD_CONFIG;
  const stored = localStorage.getItem(AD_CONFIG_KEY);
  if (!stored) return INITIAL_AD_CONFIG;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_AD_CONFIG;
  }
};

// Firestore 실시간 구독 (모든 방문자에게 실시간 반영)
export const subscribeToSiteData = (
  onUpdate: (data: {
    categories: Category[];
    contents: ContentItem[];
    adConfig: AdConfig;
  }) => void
) => {
  try {
    const docRef = doc(db, SITE_DATA_COLLECTION, SITE_DATA_DOC);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const categories = data.categories || INITIAL_CATEGORIES;
          const contents = data.contents || INITIAL_CONTENTS;
          const adConfig = data.adConfig || INITIAL_AD_CONFIG;

          // 로컬 캐시 갱신
          if (typeof window !== 'undefined') {
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
            localStorage.setItem(CONTENTS_KEY, JSON.stringify(contents));
            localStorage.setItem(AD_CONFIG_KEY, JSON.stringify(adConfig));
          }

          onUpdate({ categories, contents, adConfig });
        }
      },
      (error) => {
        console.warn('Firestore subscription fallback to local cache:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore init error, using local storage:', err);
    return () => {};
  }
};

// Firestore 저장 헬퍼 (관리자 저장 시 Firestore + LocalStorage 동시 반영)
export const saveCategories = async (categories: Category[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }
  try {
    const docRef = doc(db, SITE_DATA_COLLECTION, SITE_DATA_DOC);
    await setDoc(docRef, { categories }, { merge: true });
  } catch (err) {
    console.warn('Firestore save categories fallback:', err);
  }
};

export const saveContents = async (contents: ContentItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONTENTS_KEY, JSON.stringify(contents));
  }
  try {
    const docRef = doc(db, SITE_DATA_COLLECTION, SITE_DATA_DOC);
    await setDoc(docRef, { contents }, { merge: true });
  } catch (err) {
    console.warn('Firestore save contents fallback:', err);
  }
};

export const saveAdConfig = async (adConfig: AdConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AD_CONFIG_KEY, JSON.stringify(adConfig));
  }
  try {
    const docRef = doc(db, SITE_DATA_COLLECTION, SITE_DATA_DOC);
    await setDoc(docRef, { adConfig }, { merge: true });
  } catch (err) {
    console.warn('Firestore save adConfig fallback:', err);
  }
};
