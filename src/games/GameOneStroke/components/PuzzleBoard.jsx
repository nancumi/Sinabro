import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getEdgeKey } from '../utils/generator';
import { oneStrokeSound } from '../utils/sound';

export default function PuzzleBoard({
  stageData,
  onStageClear,
  onRestart,
}) {
  const { nodes, edges } = stageData;

  // 플레이어가 지나간 노드 경로: [nodeId1, nodeId2, ...]
  const [visitedNodes, setVisitedNodes] = useState([]);
  // 플레이어가 통과한 간선 집합: Set of "min-max"
  const [traversedEdges, setTraversedEdges] = useState(new Set());
  // 드래그 중인 실시간 포인터 좌표: { x, y } | null
  const [dragPoint, setDragPoint] = useState(null);
  // 터치 중 여부
  const [isPointerDown, setIsPointerDown] = useState(false);
  // 반짝이는 별가루 파티클 효과: [{ id, x, y, size, opacity }]
  const [particles, setParticles] = useState([]);

  const svgRef = useRef(null);

  // 스테이지 변경 시 초기화
  useEffect(() => {
    setVisitedNodes([]);
    setTraversedEdges(new Set());
    setDragPoint(null);
    setIsPointerDown(false);
    setParticles([]);
  }, [stageData]);

  // 간선 인접 여부 맵 생성
  const edgeAdjacencyMap = useRef(new Map());
  useEffect(() => {
    const map = new Map();
    edges.forEach(({ from, to }) => {
      const key = getEdgeKey(from, to);
      map.set(key, true);
    });
    edgeAdjacencyMap.current = map;
  }, [edges]);

  // 파티클 생성 함수
  const spawnParticles = (x, y) => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
      const speed = 12 + Math.random() * 20;
      return {
        id: Date.now() + Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        opacity: 1,
      };
    });
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // 파티클 애니메이션 프레임
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.25,
            y: p.y + p.vy * 0.25,
            opacity: p.opacity - 0.12,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 30);
    return () => clearTimeout(timer);
  }, [particles]);

  // 화면 좌표를 SVG 내부 400x400 좌표계로 변환
  const getSvgCoordinates = useCallback((e) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return null;

    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  // 노드 터치 판정 (노드 반경 28px 이내)
  const findNodeAtPosition = useCallback((x, y) => {
    const HIT_RADIUS = 30;
    return nodes.find((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS;
    });
  }, [nodes]);

  // 포인터 다운 (시작점 지정)
  const handlePointerDown = (e) => {
    const coords = getSvgCoordinates(e);
    if (!coords) return;

    try {
      e.target.setPointerCapture?.(e.pointerId);
    } catch {}

    const clickedNode = findNodeAtPosition(coords.x, coords.y);
    if (clickedNode) {
      // 새로운 붓질 시작
      oneStrokeSound.playNodeStart();
      setVisitedNodes([clickedNode.id]);
      setTraversedEdges(new Set());
      setDragPoint(coords);
      setIsPointerDown(true);
      spawnParticles(clickedNode.x, clickedNode.y);
    }
  };

  // 포인터 이동 (선 잇기 트래킹)
  const handlePointerMove = (e) => {
    if (!isPointerDown || visitedNodes.length === 0) return;
    const coords = getSvgCoordinates(e);
    if (!coords) return;

    setDragPoint(coords);

    const currentNodeId = visitedNodes[visitedNodes.length - 1];
    const hoverNode = findNodeAtPosition(coords.x, coords.y);

    if (hoverNode && hoverNode.id !== currentNodeId) {
      const edgeKey = getEdgeKey(currentNodeId, hoverNode.id);

      // 1. 실제로 존재하는 간선인지 확인
      const isValidEdge = edgeAdjacencyMap.current.has(edgeKey);
      // 2. 이미 지나간 선이 아닌지 확인
      const isAlreadyTraversed = traversedEdges.has(edgeKey);

      if (isValidEdge && !isAlreadyTraversed) {
        // 성공적으로 새로운 선 연결!
        const nextTraversed = new Set(traversedEdges);
        nextTraversed.add(edgeKey);
        const nextVisited = [...visitedNodes, hoverNode.id];

        setTraversedEdges(nextTraversed);
        setVisitedNodes(nextVisited);
        setDragPoint(null); // 노드에 닿았으므로 고무줄 선 리셋

        oneStrokeSound.playEdgeConnected(nextTraversed.size);
        spawnParticles(hoverNode.x, hoverNode.y);

        // 모든 선을 전부 다 지나쳤는지 클리어 체크
        if (nextTraversed.size === edges.length) {
          try {
            e.target?.releasePointerCapture?.(e.pointerId);
          } catch {}
          setIsPointerDown(false);
          setDragPoint(null);
          oneStrokeSound.playStageClear();
          onStageClear();
        }
      }
    }
  };

  // 포인터 업 (화면에서 손을 뗀 경우)
  const handlePointerUp = (e) => {
    try {
      e.target.releasePointerCapture?.(e.pointerId);
    } catch {}

    setIsPointerDown(false);
    setDragPoint(null);

    // 아직 다 연결하지 못하고 도중에 손을 뗐다면 현재 경로 유지 (다시 이어그리거나 리셋 가능)
  };

  const lastVisitedNode =
    visitedNodes.length > 0
      ? nodes.find((n) => n.id === visitedNodes[visitedNodes.length - 1])
      : null;

  return (
    <div className="relative w-full aspect-square max-w-[360px] sm:max-w-[380px] mx-auto select-none touch-none">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl cursor-crosshair overflow-visible"
        style={{ touchAction: 'none' }}
      >
        <defs>
          {/* 네온 글로우 필터 */}
          <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 은은한 펄스 필터 */}
          <filter id="node-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 선 그라디언트 (보드 400x400 절대 좌표계 적용으로 수직선/수평선 사라짐 방지) */}
          <linearGradient id="active-line-gradient" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* 1. 배경: 미완료 간선 (어두운 슬레이트 점선) */}
        {edges.map(({ from, to }) => {
          const n1 = nodes.find((n) => n.id === from);
          const n2 = nodes.find((n) => n.id === to);
          if (!n1 || !n2) return null;
          const key = getEdgeKey(from, to);
          const isDone = traversedEdges.has(key);

          // 이미 지나간 선은 아래의 완성 네온 광선이 표시하므로 숨김
          if (isDone) return null;

          return (
            <line
              key={`base-${key}`}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke="#334155"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="1 7"
              className="transition-all duration-200"
            />
          );
        })}

        {/* 2. 전경: 이미 지나간 완성 간선 (눈부신 네온 블루/인디고 광선) */}
        {edges.map(({ from, to }) => {
          const n1 = nodes.find((n) => n.id === from);
          const n2 = nodes.find((n) => n.id === to);
          if (!n1 || !n2) return null;
          const key = getEdgeKey(from, to);
          if (!traversedEdges.has(key)) return null;

          return (
            <g key={`traversed-${key}`}>
              {/* 후광 광선 */}
              <line
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="#0ea5e9"
                strokeWidth="10"
                strokeOpacity="0.45"
                strokeLinecap="round"
                filter="url(#neon-glow)"
              />
              {/* 핵심 중심 광선 */}
              <line
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="url(#active-line-gradient)"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* 3. 드래그 중인 고무줄 탄성 라인 (현재 노드 -> 마우스/터치 커서) */}
        {isPointerDown && lastVisitedNode && dragPoint && (
          <line
            x1={lastVisitedNode.x}
            y1={lastVisitedNode.y}
            x2={dragPoint.x}
            y2={dragPoint.y}
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeOpacity="0.8"
            className="pointer-events-none"
          />
        )}

        {/* 4. 노드 점 (원형 노드 버튼) */}
        {nodes.map((node) => {
          const isVisited = visitedNodes.includes(node.id);
          const isCurrent = lastVisitedNode?.id === node.id;
          const isSpecialStart =
            visitedNodes.length === 0 &&
            stageData.oddNodes?.length === 2 &&
            stageData.validStartNodes?.includes(node.id);

          return (
            <g key={`node-${node.id}`} className="cursor-pointer">
              {/* 시작점 힌트 링 (홀수점 2개인 경우 필수 시작점 강조) */}
              {isSpecialStart && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  className="opacity-90"
                />
              )}

              {/* 노드 주변 펄스 효과 (현재 활성 노드) */}
              {isCurrent && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="animate-ping opacity-60"
                />
              )}

              {/* 노드 외곽 링 */}
              <circle
                cx={node.x}
                cy={node.y}
                r="12"
                fill={isVisited ? '#0f172a' : '#1e293b'}
                stroke={
                  isCurrent
                    ? '#38bdf8'
                    : isVisited
                    ? '#818cf8'
                    : isSpecialStart
                    ? '#f59e0b'
                    : '#475569'
                }
                strokeWidth={isCurrent || isSpecialStart ? '3' : '2.5'}
                filter={isVisited || isSpecialStart ? 'url(#node-glow)' : undefined}
                className="transition-all duration-200"
              />

              {/* 노드 중심점 */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isCurrent ? '6' : '4.5'}
                fill={
                  isCurrent
                    ? '#ffffff'
                    : isVisited
                    ? '#38bdf8'
                    : isSpecialStart
                    ? '#fbbf24'
                    : '#94a3b8'
                }
                className="transition-all duration-200"
              />
            </g>
          );
        })}

        {/* 5. 은은하게 흩날리는 별가루 파티클 효과 */}
        {particles.map((p) => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill="#38bdf8"
            opacity={p.opacity}
            filter="url(#neon-glow)"
          />
        ))}
      </svg>
    </div>
  );
}

