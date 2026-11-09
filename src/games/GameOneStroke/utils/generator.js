// 한 붓 그리기 스테이지 생성기 및 기하학적 도형 정의

// 노드 고유 키 헬퍼
export function getEdgeKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

// 1. 클래식 고정 스테이지 (1~10단계)
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
      { id: 0, x: 200, y: 60 },  // 상
      { id: 1, x: 70, y: 200 },  // 좌
      { id: 2, x: 330, y: 200 }, // 우
      { id: 3, x: 200, y: 340 }, // 하
      { id: 4, x: 200, y: 200 }, // 중앙
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
      { id: 0, x: 200, y: 80 },  // 덮개
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
      { id: 0, x: 80, y: 200 },  // 주둥이
      { id: 1, x: 180, y: 100 }, // 등지느러미
      { id: 2, x: 180, y: 300 }, // 배지느러미
      { id: 3, x: 260, y: 200 }, // 꼬리 중심
      { id: 4, x: 340, y: 120 }, // 꼬리 위
      { id: 5, x: 340, y: 280 }, // 꼬리 아래
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
      { id: 6, x: 200, y: 200 }, // 중심
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
  // Stage 10: 3x3 큐빅 미로 (8개 점, 12개 선)
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
];

// 2. 무한 알고리즘 스테이지 생성기 (Stage 11 이상)
export function generateProceduralStage(stageNumber) {
  // 난이도에 따른 그리드 크기 및 선 개수 결정
  const gridSize = stageNumber < 20 ? 3 : 4;
  const targetEdges = Math.min(7 + Math.floor((stageNumber - 10) * 0.7), 20);

  // 격자 좌표 후보 생성
  const step = 260 / (gridSize - 1);
  const baseOffset = 70;
  const gridPoints = [];

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      gridPoints.push({
        id: r * gridSize + c,
        r,
        c,
        x: Math.round(baseOffset + c * step),
        y: Math.round(baseOffset + r * step),
      });
    }
  }

  // 수학적 오일러 경로(Eulerian Path) 보장 생성 알고리즘:
  // 시작점부터 인접한 정점 중 아직 지나지 않은 선을 무작위로 선택하여 걷는 Random Eulerian Walk
  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    const usedEdges = new Set();
    const solutionPath = [];
    const usedNodes = new Set();

    let currentNode = Math.floor(Math.random() * gridPoints.length);
    solutionPath.push(currentNode);
    usedNodes.add(currentNode);

    for (let stepIdx = 0; stepIdx < targetEdges; stepIdx++) {
      const p1 = gridPoints[currentNode];
      // 연결 가능한 이웃 후보 (상하좌우 및 인접 대각선)
      const neighbors = gridPoints.filter((p2) => {
        if (p2.id === currentNode) return false;
        const dr = Math.abs(p2.r - p1.r);
        const dc = Math.abs(p2.c - p1.c);
        // 맨해튼 또는 1칸 대각선 이웃
        if (dr > 1 || dc > 1) return false;
        // 이미 사용된 선 제외
        const edgeKey = getEdgeKey(currentNode, p2.id);
        return !usedEdges.has(edgeKey);
      });

      if (neighbors.length === 0) break; // 더 이상 갈 곳이 없으면 중단

      // 무작위 이웃 선택
      const nextNode = neighbors[Math.floor(Math.random() * neighbors.length)].id;
      const edgeKey = getEdgeKey(currentNode, nextNode);
      usedEdges.add(edgeKey);
      solutionPath.push(nextNode);
      usedNodes.add(nextNode);
      currentNode = nextNode;
    }

    // 선의 개수가 목표의 80% 이상 모였으면 유효한 퍼즐로 채택
    if (usedEdges.size >= Math.max(6, targetEdges - 2)) {
      // 실제 사용된 노드만 필터링하여 인덱스 재매핑
      const activeNodeList = Array.from(usedNodes).map((nodeId) => gridPoints[nodeId]);
      const idMap = new Map();
      const mappedNodes = activeNodeList.map((node, newIdx) => {
        idMap.set(node.id, newIdx);
        return {
          id: newIdx,
          x: node.x,
          y: node.y,
        };
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

      return {
        stage: stageNumber,
        title: `기하 마스터 ${stageNumber}`,
        nodes: mappedNodes,
        edges: mappedEdges,
        solution: mappedSolution,
      };
    }
  }

  // 폴백: 클래식 스테이지 중 하나를 변형 제공
  const fallback = CLASSIC_STAGES[(stageNumber - 1) % CLASSIC_STAGES.length];
  return {
    ...fallback,
    stage: stageNumber,
    title: `미러 퍼즐 ${stageNumber}`,
  };
}

// 스테이지 번호로 퍼즐 데이터 반환
export function getStageData(stageNumber) {
  if (stageNumber <= CLASSIC_STAGES.length) {
    return CLASSIC_STAGES[stageNumber - 1];
  }
  return generateProceduralStage(stageNumber);
}
