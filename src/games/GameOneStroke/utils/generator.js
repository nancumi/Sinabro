// 한 붓 그리기(Eulerian Trail) 수학적 보증 생성기 및 스테이지 관리자

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

/**
 * 오일러 경로(Eulerian Trail) 엄격 검증 및 정답 시뮬레이터 (Hierholzer Algorithm)
 * 1. 모든 노드의 차수(연결 선 개수) 계산
 * 2. 홀수점 개수가 0개(어느 점에서나 출발 가능) 또는 2개(반드시 두 점 중 하나에서 출발)인지 검증 (오일러 정리)
 * 3. 실제 모든 선을 중복 없이 방문하는 완주 경로(solution)를 시뮬레이션하여 100% 클리어 보증
 */
export function solveEulerian(nodes, edges) {
  if (!nodes || nodes.length < 3 || !edges || edges.length < 3) return null;

  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e, i) => {
    adj[e.from].push({ to: e.to, edgeIndex: i });
    adj[e.to].push({ to: e.from, edgeIndex: i });
  });

  // 홀수점(연결 선 수가 홀수인 점) 판별
  const oddNodes = nodes
    .filter((n) => adj[n.id].length % 2 !== 0)
    .map((n) => n.id);

  // 오일러 경로 법칙: 홀수점은 반드시 0개 또는 2개여야만 함!
  if (oddNodes.length !== 0 && oddNodes.length !== 2) {
    return null; // 수학적으로 절대 풀 수 없는 도형 -> 즉시 기각
  }

  // 시작점 선정: 홀수점이 2개면 반드시 그 중 하나에서 시작해야 함
  const startNode = oddNodes.length === 2 ? oddNodes[0] : nodes[0].id;
  const trail = [];
  const stack = [startNode];
  const usedEdges = new Set();
  const currentEdgeIndex = {};
  nodes.forEach((n) => (currentEdgeIndex[n.id] = 0));

  // Hierholzer 알고리즘으로 실제 경로 탐색
  while (stack.length > 0) {
    const u = stack[stack.length - 1];
    let found = false;
    while (currentEdgeIndex[u] < adj[u].length) {
      const { to: v, edgeIndex } = adj[u][currentEdgeIndex[u]++];
      if (!usedEdges.has(edgeIndex)) {
        usedEdges.add(edgeIndex);
        stack.push(v);
        found = true;
        break;
      }
    }
    if (!found) {
      trail.push(stack.pop());
    }
  }

  // 모든 간선이 빠짐없이 포함되었는지 검증 (그래프 연결성 확인)
  if (usedEdges.size !== edges.length) {
    return null;
  }

  return {
    solution: trail.reverse(),
    oddNodes,
    // 홀수점이 2개인 경우 그 2개 점만 유효한 시작점, 0개인 경우 모든 점이 유효한 시작점
    validStartNodes: oddNodes.length === 2 ? oddNodes : nodes.map((n) => n.id),
  };
}

// 1. 엄선된 20개 정통 클래식 오일러 스테이지 (전부 홀수점 0개 또는 2개 검증 완료)
export const CLASSIC_STAGES = [
  // Stage 1: 삼각형 (3노드 3에지, 0홀수)
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
  },
  // Stage 2: 모래시계 (4노드 5에지, 2홀수: 0, 2)
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
  },
  // Stage 3: 클래식 지붕집 (5노드 8에지, 2홀수: 3, 4)
  {
    stage: 3,
    title: '클래식 지붕집',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 90, y: 160 },
      { id: 2, x: 310, y: 160 },
      { id: 3, x: 90, y: 330 },
      { id: 4, x: 310, y: 330 },
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
  },
  // Stage 4: 다이아몬드 프리즘 (5노드 6에지, 2홀수: 0, 3 - 완벽하게 풀리는 정통 오일러 구조!)
  {
    stage: 4,
    title: '다이아몬드 프리즘',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 80, y: 200 },
      { id: 2, x: 320, y: 200 },
      { id: 3, x: 200, y: 340 },
      { id: 4, x: 200, y: 200 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 3 },
      { from: 3, to: 2 },
      { from: 2, to: 0 },
      { from: 0, to: 4 },
      { from: 4, to: 3 },
    ],
  },
  // Stage 5: 열린 편지봉투 (5노드 8에지, 2홀수: 3, 4)
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
  },
  // Stage 6: 빛나는 오각별 (5노드 10에지, 0홀수 - 완벽한 오일러 서킷)
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
  },
  // Stage 7: 더블 윙 트라이앵글 (5노드 6에지, 0홀수)
  {
    stage: 7,
    title: '더블 윙 트라이앵글',
    nodes: [
      { id: 0, x: 200, y: 200 },
      { id: 1, x: 80, y: 100 },
      { id: 2, x: 80, y: 300 },
      { id: 3, x: 320, y: 100 },
      { id: 4, x: 320, y: 300 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 0 },
      { from: 0, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
    ],
  },
  // Stage 8: 기하학 물고기 (6노드 8에지, 2홀수: 1, 2)
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
  },
  // Stage 9: 육각 게이트 (6노드 7에지, 2홀수: 0, 3)
  {
    stage: 9,
    title: '육각 게이트',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 320, y: 130 },
      { id: 2, x: 320, y: 270 },
      { id: 3, x: 200, y: 340 },
      { id: 4, x: 80, y: 270 },
      { id: 5, x: 80, y: 130 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
      { from: 0, to: 3 },
    ],
  },
  // Stage 10: 트리플 피라미드 (6노드 9에지, 0홀수)
  {
    stage: 10,
    title: '트리플 피라미드',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 140, y: 180 },
      { id: 2, x: 260, y: 180 },
      { id: 3, x: 80, y: 320 },
      { id: 4, x: 200, y: 320 },
      { id: 5, x: 320, y: 320 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ],
  },
  // Stage 11: 신비의 육각별 (6노드 12에지, 0홀수)
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
  },
  // Stage 12: 바람개비 풍차 (7노드 10에지, 2홀수: 1, 6)
  {
    stage: 12,
    title: '바람개비 풍차',
    nodes: [
      { id: 0, x: 200, y: 200 },
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
  },
  // Stage 13: 나비 브릿지 (5노드 7에지, 2홀수: 1, 3)
  {
    stage: 13,
    title: '나비 브릿지',
    nodes: [
      { id: 0, x: 200, y: 200 },
      { id: 1, x: 80, y: 100 },
      { id: 2, x: 80, y: 300 },
      { id: 3, x: 320, y: 100 },
      { id: 4, x: 320, y: 300 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 0 },
      { from: 0, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
      { from: 1, to: 3 },
    ],
  },
  // Stage 14: 크루세이더 실드 (6노드 10에지, 0홀수)
  {
    stage: 14,
    title: '크루세이더 실드',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 80, y: 140 },
      { id: 2, x: 320, y: 140 },
      { id: 3, x: 80, y: 260 },
      { id: 4, x: 320, y: 260 },
      { id: 5, x: 200, y: 350 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
      { from: 1, to: 4 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
    ],
  },
  // Stage 15: 로열 크라운 (7노드 10에지, 2홀수: 0, 3)
  {
    stage: 15,
    title: '로열 크라운',
    nodes: [
      { id: 0, x: 70, y: 280 },
      { id: 1, x: 150, y: 280 },
      { id: 2, x: 250, y: 280 },
      { id: 3, x: 330, y: 280 },
      { id: 4, x: 110, y: 140 },
      { id: 5, x: 200, y: 80 },
      { id: 6, x: 290, y: 140 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 4, to: 1 },
      { from: 1, to: 5 },
      { from: 5, to: 2 },
      { from: 2, to: 6 },
      { from: 6, to: 3 },
    ],
  },
  // Stage 16: 샤이닝 쥬얼 (6노드 11에지, 2홀수: 0, 1)
  {
    stage: 16,
    title: '샤이닝 쥬얼',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 200, y: 340 },
      { id: 2, x: 70, y: 200 },
      { id: 3, x: 330, y: 200 },
      { id: 4, x: 200, y: 140 },
      { id: 5, x: 200, y: 260 },
    ],
    edges: [
      { from: 0, to: 2 },
      { from: 2, to: 1 },
      { from: 1, to: 3 },
      { from: 3, to: 0 },
      { from: 4, to: 2 },
      { from: 4, to: 3 },
      { from: 5, to: 2 },
      { from: 5, to: 3 },
      { from: 0, to: 4 },
      { from: 1, to: 5 },
      { from: 4, to: 5 },
    ],
  },
  // Stage 17: 스페이스 로켓 (8노드 12에지, 2홀수: 3, 4)
  {
    stage: 17,
    title: '스페이스 로켓',
    nodes: [
      { id: 0, x: 200, y: 50 },
      { id: 1, x: 140, y: 140 },
      { id: 2, x: 260, y: 140 },
      { id: 3, x: 140, y: 260 },
      { id: 4, x: 260, y: 260 },
      { id: 5, x: 70, y: 320 },
      { id: 6, x: 330, y: 320 },
      { id: 7, x: 200, y: 320 },
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
  },
  // Stage 18: 육각 프리즘 스타 (6노드 12에지, 0홀수)
  {
    stage: 18,
    title: '육각 프리즘 스타',
    nodes: [
      { id: 0, x: 200, y: 60 },
      { id: 1, x: 320, y: 130 },
      { id: 2, x: 320, y: 270 },
      { id: 3, x: 200, y: 340 },
      { id: 4, x: 80, y: 270 },
      { id: 5, x: 80, y: 130 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
      { from: 0, to: 2 },
      { from: 2, to: 4 },
      { from: 4, to: 0 },
      { from: 1, to: 3 },
      { from: 3, to: 5 },
      { from: 5, to: 1 },
    ],
  },
  // Stage 19: 하이퍼 큐브 (8노드 16에지, 0홀수)
  {
    stage: 19,
    title: '하이퍼 큐브',
    nodes: [
      { id: 0, x: 70, y: 70 },
      { id: 1, x: 330, y: 70 },
      { id: 2, x: 330, y: 330 },
      { id: 3, x: 70, y: 330 },
      { id: 4, x: 140, y: 140 },
      { id: 5, x: 260, y: 140 },
      { id: 6, x: 260, y: 260 },
      { id: 7, x: 140, y: 260 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 0 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 4 },
      { from: 0, to: 4 },
      { from: 1, to: 5 },
      { from: 2, to: 6 },
      { from: 3, to: 7 },
      { from: 0, to: 7 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
    ],
  },
  // Stage 20: 신화의 만다라 (8노드 16에지, 0홀수)
  {
    stage: 20,
    title: '신화의 만다라',
    nodes: Array.from({ length: 8 }).map((_, i) => {
      const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      return {
        id: i,
        x: Math.round(200 + Math.cos(a) * 140),
        y: Math.round(200 + Math.sin(a) * 140),
      };
    }),
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 0 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 6 },
      { from: 5, to: 7 },
      { from: 6, to: 0 },
      { from: 7, to: 1 },
    ],
  },
];

// 2. 무한 프로시저 생성기 (Stage 21 이상) - solveEulerian 검증 통과 도형만 엄선
export function generateProceduralStage(stageNumber, usedFingerprints = new Set()) {
  const layoutType = stageNumber % 3;

  for (let attempt = 0; attempt < 200; attempt++) {
    let candidatePoints = [];

    if (layoutType === 0) {
      // 3x3 격자
      const step = 110;
      const offset = 90;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          candidatePoints.push({
            id: r * 3 + c,
            x: Math.round(offset + c * step),
            y: Math.round(offset + r * step),
          });
        }
      }
    } else if (layoutType === 1) {
      // 원형 휠 (중심 1개 + 외곽 6개)
      candidatePoints.push({ id: 0, x: 200, y: 200 });
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        candidatePoints.push({
          id: i + 1,
          x: Math.round(200 + Math.cos(a) * 135),
          y: Math.round(200 + Math.sin(a) * 135),
        });
      }
    } else {
      // 다이아몬드 (1-2-3-2-1 배치)
      const rows = [1, 2, 3, 2, 1];
      let idCounter = 0;
      rows.forEach((count, rIdx) => {
        const y = 75 + rIdx * 62;
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

    const targetEdges = Math.min(7 + Math.floor((stageNumber - 20) * 0.4), 20);
    const usedEdges = new Set();
    const edges = [];
    const usedNodeIds = new Set();

    let currentNode = Math.floor(Math.random() * candidatePoints.length);
    usedNodeIds.add(currentNode);

    for (let s = 0; s < targetEdges; s++) {
      const p1 = candidatePoints[currentNode];
      const maxDistSq = 145 * 145;
      const neighbors = candidatePoints.filter((p2) => {
        if (p2.id === currentNode) return false;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        if (dx * dx + dy * dy > maxDistSq) return false;
        const k = getEdgeKey(currentNode, p2.id);
        return !usedEdges.has(k);
      });

      if (neighbors.length === 0) break;

      const nextNode = neighbors[Math.floor(Math.random() * neighbors.length)].id;
      const k = getEdgeKey(currentNode, nextNode);
      usedEdges.add(k);
      edges.push({ from: Math.min(currentNode, nextNode), to: Math.max(currentNode, nextNode) });
      usedNodeIds.add(nextNode);
      currentNode = nextNode;
    }

    if (edges.length >= 6) {
      const activeNodes = Array.from(usedNodeIds).map((id) => candidatePoints[id]);
      const idMap = new Map();
      const mappedNodes = activeNodes.map((n, idx) => {
        idMap.set(n.id, idx);
        return { id: idx, x: n.x, y: n.y };
      });

      const mappedEdges = edges.map((e) => ({
        from: idMap.get(e.from),
        to: idMap.get(e.to),
      }));

      // 엄격한 오일러 경로 시뮬레이션 검증
      const verified = solveEulerian(mappedNodes, mappedEdges);
      if (verified) {
        const fingerprint = getShapeFingerprint(mappedNodes, mappedEdges);
        if (!usedFingerprints.has(fingerprint)) {
          return {
            stage: stageNumber,
            title: `마스터 아케이드 ${stageNumber}`,
            nodes: mappedNodes,
            edges: mappedEdges,
            solution: verified.solution,
            oddNodes: verified.oddNodes,
            validStartNodes: verified.validStartNodes,
            fingerprint,
          };
        }
      }
    }
  }

  // 폴백: 클래식 스테이지 중 하나를 검증하여 반환
  const fb = CLASSIC_STAGES[(stageNumber - 1) % CLASSIC_STAGES.length];
  const verified = solveEulerian(fb.nodes, fb.edges);
  return {
    ...fb,
    stage: stageNumber,
    title: `미러 챌린지 ${stageNumber}`,
    ...verified,
  };
}

// 스테이지 데이터 반환 (오일러 정답 검증 통합)
export function getStageData(stageNumber, usedFingerprints = new Set()) {
  if (stageNumber <= CLASSIC_STAGES.length) {
    const raw = CLASSIC_STAGES[stageNumber - 1];
    const verified = solveEulerian(raw.nodes, raw.edges);
    return {
      ...raw,
      ...verified,
    };
  }
  return generateProceduralStage(stageNumber, usedFingerprints);
}
