// 10가지 직관적인 프리셋 색상 팔레트
export const PALETTE_COLORS = [
  { id: 'black', name: '블랙', hex: '#000000', borderHex: '#334155', isDark: true },
  { id: 'white', name: '화이트', hex: '#ffffff', borderHex: '#e2e8f0', isDark: false },
  { id: 'red', name: '네온 레드', hex: '#ff1e42', borderHex: '#f43f5e', isDark: true },
  { id: 'orange', name: '네온 오렌지', hex: '#ff7a00', borderHex: '#fb923c', isDark: true },
  { id: 'yellow', name: '네온 옐로우', hex: '#ffe600', borderHex: '#facc15', isDark: false },
  { id: 'green', name: '네온 그린', hex: '#00ff66', borderHex: '#4ade80', isDark: false },
  { id: 'cyan', name: '네온 시안', hex: '#00f0ff', borderHex: '#38bdf8', isDark: false },
  { id: 'blue', name: '네온 블루', hex: '#2979ff', borderHex: '#60a5fa', isDark: true },
  { id: 'purple', name: '네온 퍼플', hex: '#d900ff', borderHex: '#c084fc', isDark: true },
  { id: 'pink', name: '네온 핑크', hex: '#ff007f', borderHex: '#f472b6', isDark: true },
];

// 글자 모션 효과 리스트
export const TEXT_EFFECTS = [
  { id: 'marquee-right', label: '좌→우 흐르기', desc: '왼쪽에서 오른쪽으로 흐름' },
  { id: 'marquee-left', label: '우→좌 흐르기', desc: '오른쪽에서 왼쪽으로 흐름' },
  { id: 'blink', label: '깜빡이기', desc: '화려하게 점멸' },
  { id: 'bounce', label: '통통 튀기', desc: '위아래로 통통 바운스' },
  { id: 'glow', label: '네온 펄스', desc: '숨쉬듯 빛나는 후광' },
  { id: 'static', label: '고정 (정지)', desc: '중앙에 얌전히 멈춤' },
];

// 배경 효과 리스트
export const BG_EFFECTS = [
  { id: 'dots', label: '도트 매트릭스', desc: '클래식 LED 전광판 구멍 격자' },
  { id: 'scanline', label: '레트로 스캔라인', desc: 'CRT 브라운관 가로줄 감성' },
  { id: 'gradient', label: '그라데이션 모션', desc: '은은하게 흐르는 다채로운 색감' },
  { id: 'solid', label: '깔끔한 단색', desc: '군더더기 없는 미니멀 스타일' },
];

// 폰트 크기 옵션
export const FONT_SIZES = [
  { id: 'sm', label: '작게', px: 32, css: 'text-[32px]' },
  { id: 'md', label: '보통', px: 48, css: 'text-[48px]' },
  { id: 'lg', label: '크게', px: 64, css: 'text-[64px]' },
  { id: 'xl', label: '아주 크게', px: 84, css: 'text-[84px]' },
];

// 속도 옵션
export const SPEEDS = [
  { id: 'slow', label: '느림', factor: 1.6, durationSec: 10 },
  { id: 'normal', label: '보통', factor: 1.0, durationSec: 6 },
  { id: 'fast', label: '빠름', factor: 0.6, durationSec: 3.5 },
];
