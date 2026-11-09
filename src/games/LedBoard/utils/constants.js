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

// 글자 모션 효과 리스트 (2단계)
export const TEXT_EFFECTS = [
  { id: 'marquee-right', label: '좌→우 흐르기', desc: '왼쪽에서 오른쪽으로 흐름' },
  { id: 'marquee-left', label: '우→좌 흐르기', desc: '오른쪽에서 왼쪽으로 흐름' },
  { id: 'blink', label: '깜빡이기', desc: '글자가 화려하게 점멸' },
  { id: 'bounce', label: '통통 튀기', desc: '위아래로 통통 바운스' },
  { id: 'glow', label: '네온 펄스', desc: '숨쉬듯 빛나는 후광' },
  { id: 'static', label: '고정 (정지)', desc: '중앙에 얌전히 멈춤' },
];

// 외부 광선(Glow) 효과 옵션
export const GLOW_LEVELS = [
  { id: 'none', label: '광선 없음', desc: '군더더기 없는 플랫 폰트' },
  { id: 'soft', label: '은은한 광선', desc: '부드러운 빛 번짐' },
  { id: 'neon', label: '네온 광선', desc: '선명하고 밝은 네온 (기본)' },
  { id: 'intense', label: '초강력 발광', desc: '시선을 사로잡는 폭발적 후광' },
];

// 배경 효과 리스트 (3단계 - 깔끔한 단색이 기본값으로 맨 왼쪽 배치)
export const BG_EFFECTS = [
  { id: 'solid', label: '깔끔한 단색', desc: '군더더기 없는 미니멀 스타일 (기본)' },
  { id: 'strobe', label: '배경 깜빡임', desc: '클럽/응원 비트에 맞춘 스트로브 점멸' },
  { id: 'neon-cycle', label: '네온 사이키', desc: '다채로운 네온 컬러가 실시간 순환' },
  { id: 'aurora', label: '오로라 무대조명', desc: '신비롭고 몽환적인 그라데이션 빛' },
];

// 폰트 크기 옵션
export const FONT_SIZES = [
  { id: 'sm', label: '작게', px: 32 },
  { id: 'md', label: '보통', px: 48 },
  { id: 'lg', label: '크게', px: 64 },
  { id: 'xl', label: '아주 크게', px: 84 },
];

// 속도 옵션
export const SPEEDS = [
  { id: 'slow', label: '느림', factor: 1.6, durationSec: 10 },
  { id: 'normal', label: '보통', factor: 1.0, durationSec: 6 },
  { id: 'fast', label: '빠름', factor: 0.6, durationSec: 3.5 },
];
