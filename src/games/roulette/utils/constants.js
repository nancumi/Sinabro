export const COLOR_PALETTE = [
  '#4f46e5', // indigo
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#ec4899', // pink
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f97316', // orange
  '#3b82f6', // blue
  '#14b8a6', // teal
  '#e11d48', // rose
  '#84cc16', // lime
  '#a855f7', // purple
];

export const PRESET_OPTIONS = [
  {
    id: 'penalty',
    name: '🔥 벌칙 복불복',
    target: '벌칙자 뽑기',
    items: [
      { text: '커피 쏘기 ☕', weight: 1 },
      { text: '노래 한 곡 부르기 🎤', weight: 1 },
      { text: '엉덩이로 이름 쓰기 🍑', weight: 1 },
      { text: '편의점 심부름 🏃', weight: 1 },
      { text: '딱밤 맞기 💥', weight: 1 },
      { text: '🌟 럭키! 면제권', weight: 1 },
    ],
  },
  {
    id: 'winner',
    name: '🏆 1등 당첨 뽑기',
    target: '당첨자 뽑기',
    items: [
      { text: '🎉 1등 (주인공)', weight: 1 },
      { text: '2등 (아차상)', weight: 1 },
      { text: '3등 (참가상)', weight: 1 },
      { text: '꽝 (다음 기회에)', weight: 1 },
      { text: '보너스 한 번 더!', weight: 1 },
      { text: '꽝', weight: 1 },
    ],
  },
  {
    id: 'lunch',
    name: '🍱 오늘 뭐 먹지?',
    target: '메뉴 결정',
    items: [
      { text: '제육볶음 & 백반', weight: 1 },
      { text: '뜨끈한 국밥', weight: 1 },
      { text: '수제 햄버거', weight: 1 },
      { text: '돈까스 & 우동', weight: 1 },
      { text: '짜장면 & 짬뽕', weight: 1 },
      { text: '마라탕 / 훠궈', weight: 1 },
      { text: '피자 & 파스타', weight: 1 },
      { text: '건강한 샐러드', weight: 1 },
    ],
  },
  {
    id: 'role',
    name: '🤝 모임 역할 분담',
    target: '역할 정하기',
    items: [
      { text: '장소 예약 & 총무', weight: 1 },
      { text: '분위기 메이커', weight: 1 },
      { text: '인증샷 촬영 담당', weight: 1 },
      { text: '2차 장소 물색', weight: 1 },
      { text: '건배사 제의자', weight: 1 },
      { text: '자유인 (면제)', weight: 1 },
    ],
  },
];

export const DEFAULT_PLAYERS = ['플레이어 1', '플레이어 2'];

