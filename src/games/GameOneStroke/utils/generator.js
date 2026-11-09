// 한 붓 그리기 스테이지 생성기 및 기하학적 도형 정의

// 간선 고유 키 헬퍼 (무방향)
export function getEdgeKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

// 도형 고유 지문 생성 (중복 체크용)
export function getShapeFingerprint(nodes, edges) {
  const edgeList = edges
    .map((e) => getEdgeKey(e.from, e.to))
    .sort()
    .join(';');
  return `${nodes.length}_${edges.length}_${edgeList}`;
}

// 1. 엄선된 클래식 기하 도형 20선 (완벽한 오일러 경로 검증 완료)
export const CLASSIC_STAGES = [
  // Stage 1: 삼각형 (3개 점, 3개 선)
  {
    stage: 1,
    title: '입문: 트라이앵글',
    nodes: [
      { id: 0, x: 200, y: 70 },
      { id: 1, x: 80, y: 310 },
      { id: 2, x: 320, y: 310 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 0 },
    ],
    solution: [0, 1, 2, 0],
  },
  // Stage 2: 리본 / 모래시계 (4개 점, 5개 선)
  {
    stage: 2,
    title: '모래시계',
    nodes: [
      { id: 0, x: 100, y: 80 },
      { id: 1, x: 300, y: 80 },
      { id: 2, x: 100, y: 320 },
      { id: 3, x: 300, y: 320 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 0 },
      { from: 0, to: 2 },
    ],
    solution: [3, 0, 1, 2, 0, 2],
  },
  // Stage 3: 클래식 집 모양 (5개 점, 8개 선)
  {
    stage: 3,
    title: '클래식 지붕집',
    nodes: [
      { id: 0, x: 200, y: 60 },  // 지붕 꼭짓점
      { id: 1, x: 90, y: 160 },  // 좌상단
      { id: 2, x: 310, y: 160 }, // 우상단
      { id: 3, x: 90, y: 330 },  // 좌하단
      { id: 4, x: 310, y: 330 }, // 우하단
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 1, to: 4 },
      { from: 2, to: 3 },
    ],
    solution: [3, 1, 0, 2, 1, 4, 2, 3, 4],
  },
  // Stage 4: 다이아몬드 크로스 (5개 점, 8개 선)
  {
    stage: 4,
    title: '다이아몬드 크로스',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 70, y: 200 },
      { id: 2, x: 330, y: 200 },
      { id: 3, x: 200, y: 340 },
      { id: 4, x: 200, y: 200 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 3 },
      { from: 3, to: 2 },
      { from: 2, to: 0 },
      { from: 0, to: 4 },
      { from: 3, to: 4 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
    ],
    solution: [1, 0, 2, 3, 1, 4, 0, 2, 4],
  },
  // Stage 5: 편지봉투 (5개 점, 8개 선)
  {
    stage: 5,
    title: '열린 편지봉투',
    nodes: [
      { id: 0, x: 200, y: 80 },
      { id: 1, x: 80, y: 170 },
      { id: 2, x: 320, y: 170 },
      { id: 3, x: 80, y: 330 },
      { id: 4, x: 320, y: 330 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 1, to: 4 },
      { from: 2, to: 3 },
    ],
    solution: [4, 1, 0, 2, 1, 3, 2, 4, 3],
  },
  // Stage 6: 별 오각형 (5개 점, 10개 선)
  {
    stage: 6,
    title: '빛나는 오각별',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 333, y: 157 },
      { id: 2, x: 282, y: 314 },
      { id: 3, x: 118, y: 314 },
      { id: 4, x: 67, y: 157 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
      { from: 0, to: 2 },
      { from: 2, to: 4 },
      { from: 4, to: 1 },
      { from: 1, to: 3 },
      { from: 3, to: 0 },
    ],
    solution: [0, 1, 2, 3, 4, 0, 2, 4, 1, 3, 0],
  },
  // Stage 7: 더블 피라미드 (6개 점, 9개 선)
  {
    stage: 7,
    title: '더블 피라미드',
    nodes: [
      { id: 0, x: 140, y: 80 },
      { id: 1, x: 260, y: 80 },
      { id: 2, x: 80, y: 200 },
      { id: 3, x: 320, y: 200 },
      { id: 4, x: 140, y: 320 },
      { id: 5, x: 260, y: 320 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
      { from: 2, to: 1 },
      { from: 0, to: 3 },
      { from: 2, to: 5 },
    ],
    solution: [4, 5, 2, 1, 0, 3, 5, 3, 1, 0],
  },
  // Stage 8: 물고기 도형 (6개 점, 8개 선)
  {
    stage: 8,
    title: '기하학 물고기',
    nodes: [
      { id: 0, x: 80, y: 200 },
      { id: 1, x: 180, y: 100 },
      { id: 2, x: 180, y: 300 },
      { id: 3, x: 260, y: 200 },
      { id: 4, x: 340, y: 120 },
      { id: 5, x: 340, y: 280 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 3 },
      { from: 3, to: 2 },
      { from: 2, to: 0 },
      { from: 1, to: 2 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 3 },
    ],
    solution: [1, 0, 2, 1, 3, 4, 5, 3, 2],
  },
  // Stage 9: 육각 눈꽃 (7개 점, 12개 선)
  {
    stage: 9,
    title: '육각 스노우',
    nodes: [
      { id: 0, x: 200, y: 70 },
      { id: 1, x: 310, y: 135 },
      { id: 2, x: 310, y: 265 },
      { id: 3, x: 200, y: 330 },
      { id: 4, x: 90, y: 265 },
      { id: 5, x: 90, y: 135 },
      { id: 6, x: 200, y: 200 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
      { from: 0, to: 6 },
      { from: 1, to: 6 },
      { from: 2, to: 6 },
      { from: 3, to: 6 },
      { from: 4, to: 6 },
      { from: 5, to: 6 },
    ],
    solution: [0, 1, 6, 2, 3, 6, 4, 5, 6, 0, 5, 4, 3],
  },
  // Stage 10: 큐빅 래비린스 (8개 점, 12개 선)
  {
    stage: 10,
    title: '큐빅 래비린스',
    nodes: [
      { id: 0, x: 80, y: 80 },
      { id: 1, x: 200, y: 80 },
      { id: 2, x: 320, y: 80 },
      { id: 3, x: 320, y: 200 },
      { id: 4, x: 320, y: 320 },
      { id: 5, x: 200, y: 320 },
      { id: 6, x: 80, y: 320 },
      { id: 7, x: 80, y: 200 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 0 },
      { from: 0, to: 4 },
      { from: 2, to: 6 },
      { from: 1, to: 5 },
      { from: 7, to: 3 },
    ],
    solution: [0, 1, 2, 3, 4, 5, 6, 7, 0, 4, 1, 5, 6],
  },
  // Stage 11: 다윗의 육각별 (6개 꼭짓점, 12개 선)
  {
    stage: 11,
    title: '신비의 육각별',
    nodes: [
      { id: 0, x: 200, y: 50 },
      { id: 1, x: 330, y: 125 },
      { id: 2, x: 330, y: 275 },
      { id: 3, x: 200, y: 350 },
      { id: 4, x: 70, y: 275 },
      { id: 5, x: 70, y: 125 },
    ],
    edges: [
      { from: 0, to: 2 },
      { from: 2, to: 4 },
      { from: 4, to: 0 },
      { from: 3, to: 5 },
      { from: 5, to: 1 },
      { from: 1, to: 3 },
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
    ],
    solution: [0, 1, 2, 3, 4, 5, 0, 2, 4, 0, 1, 3, 5],
  },
  // Stage 12: 바람개비 풍차 (7개 점, 10개 선)
  {
    stage: 12,
    title: '바람개비 풍차',
    nodes: [
      { id: 0, x: 200, y: 200 }, // 중심
      { id: 1, x: 200, y: 60 },
      { id: 2, x: 290, y: 90 },
      { id: 3, x: 340, y: 200 },
      { id: 4, x: 200, y: 340 },
      { id: 5, x: 110, y: 310 },
      { id: 6, x: 60, y: 200 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 0 },
      { from: 0, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
      { from: 0, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 0 },
      { from: 1, to: 6 },
    ],
    solution: [1, 2, 0, 3, 4, 0, 5, 6, 0, 1, 6],
  },
  // Stage 13: 나비 넥타이 (7개 점, 10개 선)
  {
    stage: 13,
    title: '나비 리본',
    nodes: [
      { id: 0, x: 200, y: 200 }, // 매듭
      { id: 1, x: 80, y: 100 },
      { id: 2, x: 80, y: 300 },
      { id: 3, x: 140, y: 200 },
      { id: 4, x: 320, y: 100 },
      { id: 5, x: 320, y: 300 },
      { id: 6, x: 260, y: 200 },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 1 },
      { from: 3, to: 0 },
      { from: 0, to: 6 },
      { from: 6, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 1, to: 0 },
      { from: 0, to: 4 },
    ],
    solution: [2, 1, 3, 2, 3, 0, 1, 0, 6, 4, 5, 6],
  },
  // Stage 14: 중세의 방패 (7개 점, 11개 선)
  {
    stage: 14,
    title: '나이트 실드',
    nodes: [
      { id: 0, x: 90, y: 80 },
      { id: 1, x: 200, y: 80 },
      { id: 2, x: 310, y: 80 },
      { id: 3, x: 90, y: 220 },
      { id: 4, x: 310, y: 220 },
      { id: 5, x: 200, y: 220 },
      { id: 6, x: 200, y: 340 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 0, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
      { from: 3, to: 6 },
      { from: 4, to: 6 },
      { from: 5, to: 6 },
      { from: 1, to: 5 },
      { from: 0, to: 5 },
    ],
    solution: [2, 1, 0, 3, 5, 1, 5, 6, 3, 6, 4, 5],
  },
  // Stage 15: 빛나는 왕관 (8개 점, 13개 선)
  {
    stage: 15,
    title: '로열 크라운',
    nodes: [
      { id: 0, x: 70, y: 260 },
      { id: 1, x: 150, y: 260 },
      { id: 2, x: 250, y: 260 },
      { id: 3, x: 330, y: 260 },
      { id: 4, x: 70, y: 130 },
      { id: 5, x: 150, y: 180 },
      { id: 6, x: 200, y: 90 },
      { id: 7, x: 330, y: 130 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 0, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 2 },
      { from: 2, to: 7 },
      { from: 7, to: 3 },
      { from: 1, to: 5 },
      { from: 5, to: 2 },
      { from: 1, to: 6 },
      { from: 0, to: 5 },
    ],
    solution: [4, 0, 1, 2, 3, 7, 2, 6, 5, 1, 6, 5, 0, 5],
  },
  // Stage 16: 보석 다이아몬드 (8개 점, 14개 선)
  {
    stage: 16,
    title: '샤이닝 쥬얼',
    nodes: [
      { id: 0, x: 140, y: 90 },
      { id: 1, x: 260, y: 90 },
      { id: 2, x: 70, y: 180 },
      { id: 3, x: 140, y: 180 },
      { id: 4, x: 260, y: 180 },
      { id: 5, x: 330, y: 180 },
      { id: 6, x: 200, y: 330 },
      { id: 7, x: 200, y: 180 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 5 },
      { from: 2, to: 3 },
      { from: 3, to: 7 },
      { from: 7, to: 4 },
      { from: 4, to: 5 },
      { from: 2, to: 6 },
      { from: 3, to: 6 },
      { from: 7, to: 6 },
      { from: 4, to: 6 },
      { from: 5, to: 6 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
    ],
    solution: [0, 1, 5, 4, 1, 0, 3, 2, 0, 2, 6, 3, 7, 6, 4, 6, 5],
  },
  // Stage 17: 우주 로켓 (8개 점, 12개 선)
  {
    stage: 17,
    title: '스페이스 로켓',
    nodes: [
      { id: 0, x: 200, y: 50 },  // 노즈콘
      { id: 1, x: 140, y: 140 },
      { id: 2, x: 260, y: 140 },
      { id: 3, x: 140, y: 260 },
      { id: 4, x: 260, y: 260 },
      { id: 5, x: 70, y: 320 },  // 좌익
      { id: 6, x: 330, y: 320 }, // 우익
      { id: 7, x: 200, y: 320 }, // 부스터
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 3, to: 5 },
      { from: 5, to: 7 },
      { from: 7, to: 6 },
      { from: 6, to: 4 },
      { from: 3, to: 7 },
      { from: 4, to: 7 },
    ],
    solution: [5, 3, 1, 0, 2, 4, 6, 7, 5, 7, 4, 3, 7],
  },
  // Stage 18: 크리스탈 프리즘 (8개 점, 13개 선)
  {
    stage: 18,
    title: '크리스탈 프리즘',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 100, y: 150 },
      { id: 2, x: 300, y: 150 },
      { id: 3, x: 60, y: 270 },
      { id: 4, x: 340, y: 270 },
      { id: 5, x: 150, y: 330 },
      { id: 6, x: 250, y: 330 },
      { id: 7, x: 200, y: 200 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 6 },
      { from: 5, to: 6 },
      { from: 1, to: 7 },
      { from: 2, to: 7 },
      { from: 5, to: 7 },
      { from: 6, to: 7 },
      { from: 3, to: 1 },
    ],
    solution: [3, 5, 6, 4, 2, 0, 1, 2, 7, 5, 7, 6, 7, 1, 3],
  },
  // Stage 19: 오각 뫼비우스 (9개 점, 14개 선)
  {
    stage: 19,
    title: '오각 뫼비우스',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 320, y: 130 },
      { id: 2, x: 280, y: 290 },
      { id: 3, x: 120, y: 290 },
      { id: 4, x: 80, y: 130 },
      { id: 5, x: 200, y: 140 },
      { id: 6, x: 250, y: 210 },
      { id: 7, x: 150, y: 210 },
      { id: 8, x: 200, y: 260 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
      { from: 0, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 8 },
      { from: 8, to: 7 },
      { from: 7, to: 5 },
      { from: 1, to: 6 },
      { from: 2, to: 8 },
      { from: 3, to: 8 },
      { from: 4, to: 7 },
    ],
    solution: [1, 0, 4, 3, 2, 1, 6, 5, 0, 5, 7, 4, 7, 8, 6, 8, 3],
  },
  // Stage 20: 신화의 만다라 (9개 점, 16개 선)
  {
    stage: 20,
    title: '신화의 만다라',
    nodes: [
      { id: 0, x: 200, y: 70 },
      { id: 1, x: 290, y: 110 },
      { id: 2, x: 330, y: 200 },
      { id: 3, x: 290, y: 290 },
      { id: 4, x: 200, y: 330 },
      { id: 5, x: 110, y: 290 },
      { id: 6, x: 70, y: 200 },
      { id: 7, x: 110, y: 110 },
      { id: 8, x: 200, y: 200 }, // 중심
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 0 },
      { from: 0, to: 8 },
      { from: 1, to: 8 },
      { from: 2, to: 8 },
      { from: 3, to: 8 },
      { from: 4, to: 8 },
      { from: 5, to: 8 },
      { from: 6, to: 8 },
      { from: 7, to: 8 },
    ],
    solution: [0, 1, 8, 2, 3, 8, 4, 5, 8, 6, 7, 8, 0, 7, 6, 5, 4, 3, 2, 1, 0],
  },
];

// 2. 무한 프로시저 오일러 스테이지 생성기 (Stage 21 이상)
// 다양한 레이아웃 모드(격자형, 원형, 삼각 아이소메트릭)와 지문 해시로 중복 완전 차단
export function generateProceduralStage(stageNumber, usedFingerprints = new Set()) {
  const layoutType = stageNumber % 3; // 0: 3x3/4x4 격자, 1: 원형 휠, 2: 삼각 피라미드

  let bestCandidate = null;
  let attempts = 0;

  while (attempts < 150) {
    attempts++;
    let candidatePoints = [];

    if (layoutType === 0) {
      // 격자 레이아웃 (3x3 또는 4x4)
      const size = stageNumber < 35 ? 3 : 4;
      const step = 250 / (size - 1);
      const offset = 75;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          candidatePoints.push({
            id: r * size + c,
            x: Math.round(offset + c * step),
            y: Math.round(offset + r * step),
          });
        }
      }
    } else if (layoutType === 1) {
      // 원형 방사 레이아웃
      candidatePoints.push({ id: 0, x: 200, y: 200 }); // 중심
      const ringCount = stageNumber < 30 ? 6 : 8;
      const radius = 135;
      for (let i = 0; i < ringCount; i++) {
        const angle = (Math.PI * 2 * i) / ringCount - Math.PI / 2;
        candidatePoints.push({
          id: i + 1,
          x: Math.round(200 + Math.cos(angle) * radius),
          y: Math.round(200 + Math.sin(angle) * radius),
        });
      }
    } else {
      // 삼각 다이아몬드 레이아웃
      const rows = [1, 2, 3, 2, 1];
      let idCounter = 0;
      rows.forEach((count, rIdx) => {
        const y = 70 + rIdx * 65;
        const totalW = (count - 1) * 90;
        const startX = 200 - totalW / 2;
        for (let c = 0; c < count; c++) {
          candidatePoints.push({
            id: idCounter++,
            x: Math.round(startX + c * 90),
            y: Math.round(y),
          });
        }
      });
    }

    // 난이도별 목표 간선 개수
    const targetEdges = Math.min(8 + Math.floor((stageNumber - 20) * 0.45), 24);

    // 오일러 경로를 보장하는 무작위 걷기 (Random Eulerian Walk)
    const usedEdges = new Set();
    const solutionPath = [];
    const usedNodeIds = new Set();

    let currentNode = Math.floor(Math.random() * candidatePoints.length);
    solutionPath.push(currentNode);
    usedNodeIds.add(currentNode);

    for (let stepIdx = 0; stepIdx < targetEdges; stepIdx++) {
      const p1 = candidatePoints[currentNode];
      // 연결 가능한 이웃 후보 필터링 (거리 제한: 너무 먼 점은 시각적으로 지저분하므로 제외)
      const maxDistSq = 160 * 160;
      const neighbors = candidatePoints.filter((p2) => {
        if (p2.id === currentNode) return false;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        if (dx * dx + dy * dy > maxDistSq) return false;
        const edgeKey = getEdgeKey(currentNode, p2.id);
        return !usedEdges.has(edgeKey);
      });

      if (neighbors.length === 0) break;

      const nextNode = neighbors[Math.floor(Math.random() * neighbors.length)].id;
      const edgeKey = getEdgeKey(currentNode, nextNode);
      usedEdges.add(edgeKey);
      solutionPath.push(nextNode);
      usedNodeIds.add(nextNode);
      currentNode = nextNode;
    }

    // 목표 선의 80% 이상 모였으면 채택 검토
    if (usedEdges.size >= Math.max(7, targetEdges - 2)) {
      // 인덱스 압축 매핑
      const activeNodes = Array.from(usedNodeIds).map((id) => candidatePoints[id]);
      const idMap = new Map();
      const mappedNodes = activeNodes.map((n, idx) => {
        idMap.set(n.id, idx);
        return { id: idx, x: n.x, y: n.y };
      });

      const mappedEdges = [];
      usedEdges.forEach((key) => {
        const [a, b] = key.split('-').map(Number);
        mappedEdges.push({
          from: idMap.get(a),
          to: idMap.get(b),
        });
      });

      const mappedSolution = solutionPath.map((id) => idMap.get(id));
      const fingerprint = getShapeFingerprint(mappedNodes, mappedEdges);

      // 이미 이전에 출현한 도형 지문인지 중복 검사
      if (!usedFingerprints.has(fingerprint)) {
        return {
          stage: stageNumber,
          title: `마스터 아케이드 ${stageNumber}`,
          nodes: mappedNodes,
          edges: mappedEdges,
          solution: mappedSolution,
          fingerprint,
        };
      }
      bestCandidate = {
        stage: stageNumber,
        title: `마스터 아케이드 ${stageNumber}`,
        nodes: mappedNodes,
        edges: mappedEdges,
        solution: mappedSolution,
        fingerprint,
      };
    }
  }

  // 중복 필터링을 다 통과하지 못한 경우에도 최선의 생성 후보 반환
  if (bestCandidate) return bestCandidate;

  // 비상 폴백: 클래식 스테이지 회전 변형
  const fb = CLASSIC_STAGES[(stageNumber - 1) % CLASSIC_STAGES.length];
  return {
    ...fb,
    stage: stageNumber,
    title: `미러 챌린지 ${stageNumber}`,
  };
}

// 스테이지 번호로 퍼즐 데이터 반환
export function getStageData(stageNumber, usedFingerprints = new Set()) {
  if (stageNumber <= CLASSIC_STAGES.length) {
    return CLASSIC_STAGES[stageNumber - 1];
  }
  return generateProceduralStage(stageNumber, usedFingerprints);
}
