'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, Eye, EyeOff, Hash, Volume2, VolumeX, ArrowLeft, Grid3X3, Sparkles } from 'lucide-react';
import SuccessModal from './components/SuccessModal';
import { FAIRY_TALES } from './data/fairyTales';

// 셔플: 유효 이동을 역순 시뮬레이션하여 100% Solvable 상태 생성
function generateSolvablePuzzle(gridSize) {
  const totalTiles = gridSize * gridSize;
  const emptyTile = totalTiles - 1;
  const tiles = Array.from({ length: totalTiles }, (_, i) => i);
  let emptyIndex = emptyTile;
  let lastMove = -1;
  const shuffleSteps = gridSize === 4 ? 120 : gridSize === 5 ? 160 : 200;

  for (let i = 0; i < shuffleSteps; i++) {
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;
    const neighbors = [];

    if (emptyRow > 0) neighbors.push(emptyIndex - gridSize);
    if (emptyRow < gridSize - 1) neighbors.push(emptyIndex + gridSize);
    if (emptyCol > 0) neighbors.push(emptyIndex - 1);
    if (emptyCol < gridSize - 1) neighbors.push(emptyIndex + 1);

    const validNeighbors = neighbors.filter(pos => pos !== lastMove);
    const chosen = (validNeighbors.length > 0)
      ? validNeighbors[Math.floor(Math.random() * validNeighbors.length)]
      : neighbors[Math.floor(Math.random() * neighbors.length)];

    tiles[emptyIndex] = tiles[chosen];
    tiles[chosen] = emptyTile;
    lastMove = emptyIndex;
    emptyIndex = chosen;
  }

  if (tiles.every((val, idx) => val === idx)) {
    return generateSolvablePuzzle(gridSize);
  }

  return tiles;
}

export default function App() {
  const [gridSize, setGridSize] = useState(null); // 시작 전: null, 선택 후: 4, 5, 6
  const [currentFairyIndex, setCurrentFairyIndex] = useState(() => Math.floor(Math.random() * FAIRY_TALES.length));
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showNumberHint, setShowNumberHint] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const touchStartRef = useRef({ x: 0, y: 0, tilePos: null });
  const swipedRef = useRef(false);
  const timerRef = useRef(null);

  const currentFairy = FAIRY_TALES[currentFairyIndex] || FAIRY_TALES[0];
  const imageUrl = currentFairy.url;

  const totalTiles = gridSize ? gridSize * gridSize : 0;
  const emptyTile = gridSize ? totalTiles - 1 : 0;

  // Web Audio 효과음
  const playSlideSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } catch {}
  }, [soundEnabled]);

  const playSuccessSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } catch {}
  }, [soundEnabled]);

  // 게임 시작
  const startGameWithGrid = useCallback((size, nextFairyIdx = null) => {
    setGridSize(size);

    if (nextFairyIdx === null) {
      setCurrentFairyIndex((prev) => (prev + 1) % FAIRY_TALES.length);
    } else {
      setCurrentFairyIndex(nextFairyIdx);
    }

    const shuffled = generateSolvablePuzzle(size);
    setTiles(shuffled);
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(false);
    setIsSolved(false);
    setIsModalOpen(false);
    setShowPreview(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 격자 선택 화면으로 복귀
  const backToGridSelection = useCallback(() => {
    setGridSize(null);
    setTiles([]);
    setIsTimerRunning(false);
    setIsSolved(false);
    setIsModalOpen(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 타이머
  useEffect(() => {
    if (isTimerRunning && !isSolved) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isSolved]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 슬라이드 이동 처리
  const moveTile = useCallback((tilePos) => {
    if (isSolved || !gridSize || tiles.length === 0) return;

    const currentEmpty = tiles.indexOf(emptyTile);
    if (currentEmpty === -1 || tilePos === currentEmpty) return;

    const tileRow = Math.floor(tilePos / gridSize);
    const tileCol = tilePos % gridSize;
    const emptyRow = Math.floor(currentEmpty / gridSize);
    const emptyCol = currentEmpty % gridSize;

    const isAdjacent =
      (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
      (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow);

    if (!isAdjacent) return;

    playSlideSound();
    setMoves((m) => m + 1);
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    const nextTiles = [...tiles];
    nextTiles[currentEmpty] = tiles[tilePos];
    nextTiles[tilePos] = emptyTile;
    setTiles(nextTiles);

    const solved = nextTiles.every((val, idx) => val === idx);
    if (solved) {
      setIsSolved(true);
      setIsTimerRunning(false);
      playSuccessSound();

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setTimeout(() => {
        setIsModalOpen(true);
      }, 400);
    }
  }, [isSolved, gridSize, tiles, emptyTile, isTimerRunning, playSlideSound, playSuccessSound]);

  const handleTileClick = (pos) => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    moveTile(pos);
  };

  // 모바일 터치 제어
  const handleTouchStart = (pos, e) => {
    swipedRef.current = false;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      tilePos: pos
    };
  };

  const handleTouchEnd = (pos, e) => {
    const start = touchStartRef.current;
    if (start.tilePos === null || !gridSize) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= 25) {
      swipedRef.current = true;
      const currentEmpty = tiles.indexOf(emptyTile);
      if (currentEmpty !== -1) {
        const tileRow = Math.floor(pos / gridSize);
        const tileCol = pos % gridSize;
        const emptyRow = Math.floor(currentEmpty / gridSize);
        const emptyCol = currentEmpty % gridSize;

        let swipeDir = null;
        if (Math.abs(dx) > Math.abs(dy)) {
          swipeDir = dx > 0 ? 'right' : 'left';
        } else {
          swipeDir = dy > 0 ? 'down' : 'up';
        }

        const isMatch =
          (swipeDir === 'right' && emptyRow === tileRow && emptyCol === tileCol + 1) ||
          (swipeDir === 'left' && emptyRow === tileRow && emptyCol === tileCol - 1) ||
          (swipeDir === 'down' && emptyCol === tileCol && emptyRow === tileRow + 1) ||
          (swipeDir === 'up' && emptyCol === tileCol && emptyRow === tileRow - 1);

        if (isMatch) {
          moveTile(pos);
        }
      }
    }

    touchStartRef.current = { x: 0, y: 0, tilePos: null };
  };

  return (
    <div 
      className="w-full w-full flex flex-col items-center justify-center p-3 sm:p-4 bg-neutral-950 text-neutral-100 select-none overflow-x-hidden font-sans"
      style={{ fontSize: '12px' }}
    >
      <main className="w-full max-w-[440px] flex flex-col items-center gap-3">
        
        {/* [화면 1] 게임 시작 전: 격자 크기 선택 화면 */}
        {gridSize === null ? (
          <section 
            aria-label="격자 크기 선택"
            className="w-full rounded-2xl bg-neutral-900 border border-neutral-800/90 p-6 shadow-2xl flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center mb-3 text-sky-400">
              <Grid3X3 className="w-6 h-6" />
            </div>

            <h2 className="font-semibold text-neutral-100 mb-1" style={{ fontSize: '15px' }}>
              이솝 우화 슬라이딩 퍼즐
            </h2>
            <p className="text-neutral-400 text-center mb-6" style={{ fontSize: '12px' }}>
              도전할 격자 크기를 선택하면 즉시 동화 퍼즐이 시작됩니다.
            </p>

            <div className="w-full flex flex-col gap-2.5">
              {[
                { size: 4, label: '4 x 4', desc: '15 조각 · 가볍게 즐기는 모드', badge: '입문' },
                { size: 5, label: '5 x 5', desc: '24 조각 · 표준 도전 모드', badge: '추천' },
                { size: 6, label: '6 x 6', desc: '35 조각 · 고난도 마스터 모드', badge: '도전' },
              ].map(({ size, label, desc, badge }) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => startGameWithGrid(size)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-500 transition-all duration-150 active:scale-[0.98] group text-left cursor-pointer"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-100" style={{ fontSize: '14px' }}>
                        {label}
                      </span>
                      <span 
                        className={`px-1.5 py-0.5 rounded text-min font-medium ${
                          badge === '추천' 
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-neutral-700/50 text-neutral-300'
                        }`}
                      >
                        {badge}
                      </span>
                    </div>
                    <span className="text-neutral-400 mt-0.5" style={{ fontSize: '11px' }}>
                      {desc}
                    </span>
                  </div>
                  <span className="text-sky-400 font-medium group-hover:translate-x-0.5 transition-transform" style={{ fontSize: '12px' }}>
                    시작 →
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          /* [화면 2] 인게임 퍼즐 화면 */
          <>
            {/* 상단 미니멀 정보 바 (좌측 뒤로가기, 우측 아이콘 컨트롤) */}
            <section 
              aria-label="게임 컨트롤"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 shadow-md backdrop-blur-md"
            >
              {/* 좌측: 처음으로 (격자 다시 고르기) 버튼 */}
              <button
                type="button"
                onClick={backToGridSelection}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="처음으로 (격자 다시 고르기)"
                aria-label="격자 선택으로 이동"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-min font-mono font-semibold text-neutral-300">{gridSize}x{gridSize}</span>
              </button>

              {/* 우측 컨트롤: 32px 시원한 아이콘 4종 */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowNumberHint((prev) => !prev)}
                  className={`p-1.5 rounded-xl transition-all active:scale-90 cursor-pointer flex items-center justify-center ${
                    showNumberHint 
                      ? 'text-amber-300 bg-amber-500/20 ring-1 ring-amber-400/30' 
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
                  }`}
                  title="조각 번호 힌트 켜기/끄기"
                  aria-label="번호 힌트"
                >
                  <Hash className="w-8 h-8" />
                </button>

                <button
                  type="button"
                  onMouseDown={() => setShowPreview(true)}
                  onMouseUp={() => setShowPreview(false)}
                  onTouchStart={() => setShowPreview(true)}
                  onTouchEnd={() => setShowPreview(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 active:scale-90 transition-all cursor-pointer flex items-center justify-center"
                  title="누르고 있으면 원본 미리보기"
                  aria-label="미리보기"
                >
                  {showPreview ? <EyeOff className="w-8 h-8 text-sky-400" /> : <Eye className="w-8 h-8" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 active:scale-90 transition-all cursor-pointer flex items-center justify-center"
                  title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
                  aria-label="효과음"
                >
                  {soundEnabled ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8 text-neutral-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => startGameWithGrid(gridSize)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 active:scale-90 transition-all cursor-pointer flex items-center justify-center"
                  title="다음 이솝 우화로 새로고침"
                  aria-label="새로고침"
                >
                  <RefreshCw className="w-8 h-8 hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>
            </section>

            {/* 퍼즐 보드 영역 */}
            <section 
              className="relative w-full aspect-square rounded-2xl p-2 bg-neutral-900 border border-neutral-800/90 shadow-2xl overflow-hidden flex items-center justify-center"
              aria-label={`${gridSize}x${gridSize} 슬라이딩 퍼즐 보드`}
              onClick={() => {
                if (isSolved) startGameWithGrid(gridSize);
              }}
            >
              {/* 원본 미리보기 오버레이 */}
              {showPreview && (
                <div className="absolute inset-2 z-30 rounded-xl overflow-hidden border border-sky-500/40 animate-fade-in shadow-2xl bg-neutral-900 flex items-center justify-center">
                  <img src={imageUrl} alt="원본 삽화" className="w-full h-full object-contain" />
                </div>
              )}

              {/* 가변 격자 그리드 (4x4, 5x5, 6x6) */}
              <div 
                className="w-full h-full grid gap-1 relative"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {tiles.map((origIndex, currentPos) => {
                  const isEmpty = origIndex === emptyTile && !isSolved;
                  const origRow = Math.floor(origIndex / gridSize);
                  const origCol = origIndex % gridSize;

                  const bgPosX = (origCol / (gridSize - 1)) * 100;
                  const bgPosY = (origRow / (gridSize - 1)) * 100;

                  // 빈칸 디자인
                  if (isEmpty) {
                    return (
                      <div
                        key={`slot-${currentPos}`}
                        className="w-full h-full rounded-md border-2 border-dashed border-neutral-700/80 bg-neutral-950 flex items-center justify-center relative overflow-hidden shadow-inner"
                        title="빈칸"
                      >
                        <span className="text-[10px] text-neutral-600 font-mono font-bold select-none tracking-wider">
                          EMPTY
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`tile-${origIndex}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`조각 ${origIndex + 1}`}
                      onClick={() => handleTileClick(currentPos)}
                      onTouchStart={(e) => handleTouchStart(currentPos, e)}
                      onTouchEnd={(e) => handleTouchEnd(currentPos, e)}
                      className={`relative w-full h-full rounded-md overflow-hidden cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                        isSolved 
                          ? 'border border-amber-400/50 ring-1 ring-amber-400/30' 
                          : 'border border-neutral-700/80 hover:brightness-105 shadow-sm'
                      }`}
                      style={{
                        backgroundImage: `url("${imageUrl}")`,
                        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#f8fafc',
                      }}
                    >
                      {/* 조각 번호 힌트 뱃지 (11px) */}
                      {showNumberHint && !isSolved && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-neutral-100 font-mono text-[11px] font-semibold border border-white/20 leading-none pointer-events-none">
                          {origIndex + 1}
                        </div>
                      )}

                      {/* 완성 축하 애니메이션 */}
                      {isSolved && (
                        <div className="absolute inset-0 bg-amber-400/10 pointer-events-none animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 완성 시 오버레이 안내 */}
              {isSolved && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-amber-400/30 backdrop-blur-md text-amber-300 flex items-center gap-1.5 shadow-lg animate-bounce pointer-events-none">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-base-custom font-medium">완성! 터치하여 새 동화 시작</span>
                </div>
              )}
            </section>

            {/* [신규] 화면 하단 가운데 정렬: 시간 및 이동 수 표시 바 */}
            <section
              aria-label="게임 기록"
              className="w-full flex items-center justify-center gap-6 px-4 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 shadow-md backdrop-blur-md font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-min">시간</span>
                <span className="font-semibold text-neutral-100 text-base-custom">{formatTime(seconds)}</span>
              </div>
              <div className="w-px h-3.5 bg-neutral-700/60" />
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-min">이동</span>
                <span className="font-semibold text-neutral-100 text-base-custom">{moves}</span>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 완성 축하 모달창 */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRestart={() => startGameWithGrid(gridSize)}
        moves={moves}
        timeString={formatTime(seconds)}
        imageUrl={imageUrl}
      />
    </div>
  );
}
