'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Crosshair,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Timer,
  Flame,
  Zap,
  Skull,
  Star,
  Sparkles,
  Activity,
  Target,
} from 'lucide-react';
import { gridShotSound } from './utils/sound';

const BEST_KEYS = {
  3: 'gridshot_best_3x3_v1',
  4: 'gridshot_best_4x4_v1',
};

const GAME_DURATION_MS = 15000;

// 종합 등급 판정
function getGridShotRank(score, avgReactionMs, accuracy) {
  if (score >= 5200 || (score >= 4200 && accuracy >= 92 && avgReactionMs > 0 && avgReactionMs <= 260)) {
    return {
      label: '⚡ 프로게이머급 에임',
      colorClass: 'text-amber-300',
      bgClass: 'bg-amber-500/15 border-amber-500/40',
      desc: 'FPS 프로 선수급 마우스/터치 컨트롤과 경이로운 반응속도입니다!',
    };
  }
  if (score >= 3200) {
    return {
      label: '🔥 상위 1% 동체시력',
      colorClass: 'text-fuchsia-300',
      bgClass: 'bg-fuchsia-500/15 border-fuchsia-500/40',
      desc: '타겟 생성과 동시에 반응하는 최상위권 순발력입니다!',
    };
  }
  if (score >= 1600) {
    return {
      label: '👍 평범한 순발력',
      colorClass: 'text-cyan-300',
      bgClass: 'bg-cyan-500/15 border-cyan-500/40',
      desc: '안정적인 에임입니다! 콤보와 버닝 타임을 노리면 고득점 가능!',
    };
  }
  return {
    label: '🐢 손가락 예열 필요',
    colorClass: 'text-emerald-300',
    bgClass: 'bg-emerald-500/15 border-emerald-500/40',
    desc: '몸이 덜 풀렸군요! 폭탄을 피하며 정확도를 올려보세요.',
  };
}

// 초기 3개 일반 타겟 생성
function createInitialTargets(totalCells, seqRef) {
  const indices = Array.from({ length: totalCells }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, 3).map((cellIndex) => ({
    id: ++seqRef.current,
    cellIndex,
    type: 'normal',
    spawnedAt: null,
  }));
}

export default function App({ showHeader = false }) {
  const [gridSize, setGridSize] = useState(3); // 3 (3x3) | 4 (4x4)
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'PLAYING' | 'FINISHED'

  const targetSeqRef = useRef(0);
  const effectSeqRef = useRef(0);

  const [targets, setTargets] = useState(() => createInitialTargets(9, targetSeqRef));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS);
  const [bonusMsTotal, setBonusMsTotal] = useState(0);

  const [bestScores, setBestScores] = useState({ 3: null, 4: null });
  const [isNewRecord, setIsNewRecord] = useState(false);

  // 시각 피드백 상태
  const [effects, setEffects] = useState([]); // { id, cellIndex, text, variant }
  const [boardShake, setBoardShake] = useState(false);
  const [timeBonusPopId, setTimeBonusPopId] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Refs (정밀 타이밍 & 비동기 타임아웃 제어)
  const statusRef = useRef(status);
  const totalCellsRef = useRef(gridSize * gridSize);
  const endTimeRef = useRef(0);
  const rafRef = useRef(null);
  const bombTimeoutsRef = useRef(new Map());
  const shakeTimerRef = useRef(null);
  const scoreRef = useRef(0);
  const gridSizeRef = useRef(gridSize);
  const bestScoresRef = useRef(bestScores);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    totalCellsRef.current = gridSize * gridSize;
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    bestScoresRef.current = bestScores;
  }, [bestScores]);

  // 로컬 스토리지에서 모드별 최고 점수 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const b3 = localStorage.getItem(BEST_KEYS[3]);
      const b4 = localStorage.getItem(BEST_KEYS[4]);
      setBestScores({
        3: b3 !== null ? parseInt(b3, 10) : null,
        4: b4 !== null ? parseInt(b4, 10) : null,
      });
    } catch {
      // ignore
    }
  }, []);

  // 모든 폭탄 타임아웃 정리
  const clearAllBombTimeouts = useCallback(() => {
    bombTimeoutsRef.current.forEach((tid) => clearTimeout(tid));
    bombTimeoutsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      clearAllBombTimeouts();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, [clearAllBombTimeouts]);

  // 이펙트 추가 (타격 파편 / 점수 플로팅 / MISS)
  const spawnEffect = useCallback((cellIndex, text, variant) => {
    const id = ++effectSeqRef.current;
    setEffects((prev) => [...prev.slice(-10), { id, cellIndex, text, variant }]);
    setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== id));
    }, 520);
  }, []);

  // 화면/보드 흔들림 트리거
  const triggerBoardShake = useCallback(() => {
    setBoardShake(true);
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = setTimeout(() => setBoardShake(false), 320);
  }, []);

  // 게임 리셋
  const resetGame = useCallback(
    (targetSize = gridSize) => {
      clearAllBombTimeouts();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const cells = targetSize * targetSize;
      setTargets(createInitialTargets(cells, targetSeqRef));
      setStatus('IDLE');
      statusRef.current = 'IDLE';
      setScore(0);
      scoreRef.current = 0;
      setCombo(0);
      setMaxCombo(0);
      setHits(0);
      setTotalClicks(0);
      setReactionTimes([]);
      setTimeLeftMs(GAME_DURATION_MS);
      setBonusMsTotal(0);
      setIsNewRecord(false);
      setEffects([]);
      setBoardShake(false);
    },
    [gridSize, clearAllBombTimeouts]
  );

  // 모드 변경
  const handleModeChange = (newSize) => {
    if (newSize === gridSize) return;
    setGridSize(newSize);
    resetGame(newSize);
  };

  // 음소거 토글
  const handleToggleMute = () => {
    const muted = gridShotSound.toggleMute();
    setIsMuted(muted);
  };

  // 게임 종료 처리
  const finishGame = useCallback(() => {
    if (statusRef.current === 'FINISHED') return;
    clearAllBombTimeouts();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStatus('FINISHED');
    statusRef.current = 'FINISHED';
    setTimeLeftMs(0);
    gridShotSound.playFinish();

    const finalScore = scoreRef.current;
    const modeKey = gridSizeRef.current;
    const currentBest = bestScoresRef.current[modeKey];

    if (currentBest === null || finalScore > currentBest) {
      setIsNewRecord(true);
      const updated = { ...bestScoresRef.current, [modeKey]: finalScore };
      setBestScores(updated);
      try {
        localStorage.setItem(BEST_KEYS[modeKey], String(finalScore));
      } catch {
        // ignore
      }
      confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
    } else if (finalScore > 0) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }
  }, [clearAllBombTimeouts]);

  // 15초 카운트다운 루프
  useEffect(() => {
    if (status !== 'PLAYING') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      const remaining = endTimeRef.current - performance.now();
      if (remaining <= 0) {
        finishGame();
        return;
      }
      setTimeLeftMs(remaining);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status, finishGame]);

  // 새 타겟 1개 스폰 헬퍼 (현재 보드 상태 기준)
  const spawnReplacementTarget = useCallback(
    (currentList, allowSpecial = true) => {
      const occupied = new Set(currentList.map((t) => t.cellIndex));
      const emptyCells = [];
      for (let i = 0; i < totalCellsRef.current; i++) {
        if (!occupied.has(i)) emptyCells.push(i);
      }
      if (emptyCells.length === 0) return null;

      const cellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const bombCount = currentList.filter((t) => t.type === 'bomb').length;

      let type = 'normal';
      if (allowSpecial) {
        const roll = Math.random();
        if (roll < 0.1) {
          type = 'gold';
        } else if (roll < 0.2 && bombCount < 1) {
          // 보드 위 폭탄은 최대 1개까지만 등장시켜 타격 가능한 타겟 보장
          type = 'bomb';
        }
      }

      const id = ++targetSeqRef.current;
      const newTarget = {
        id,
        cellIndex,
        type,
        spawnedAt: performance.now(),
      };

      // 레드 폭탄 타겟: 1.2초 후 미터치 시 자동 소멸 & 일반 타겟으로 대체
      if (type === 'bomb') {
        const tid = setTimeout(() => {
          bombTimeoutsRef.current.delete(id);
          if (statusRef.current !== 'PLAYING') return;

          setTargets((prev) => {
            const exists = prev.find((t) => t.id === id);
            if (!exists) return prev;
            const remaining = prev.filter((t) => t.id !== id);
            const occ = new Set(remaining.map((t) => t.cellIndex));
            const empties = [];
            for (let i = 0; i < totalCellsRef.current; i++) {
              if (!occ.has(i)) empties.push(i);
            }
            if (empties.length === 0) return remaining;
            const repCell = empties[Math.floor(Math.random() * empties.length)];
            return [
              ...remaining,
              {
                id: ++targetSeqRef.current,
                cellIndex: repCell,
                type: 'normal',
                spawnedAt: performance.now(),
              },
            ];
          });
        }, 1200);
        bombTimeoutsRef.current.set(id, tid);
      }

      return newTarget;
    },
    []
  );

  // 격자 셀 클릭/터치 핸들러
  const handleCellAction = (cellIndex) => {
    if (status === 'FINISHED') return;

    const now = performance.now();
    const hitTarget = targets.find((t) => t.cellIndex === cellIndex);

    // 1. 대기 상태(IDLE)에서 첫 타겟을 맞췄을 때 게임 시작!
    if (status === 'IDLE') {
      if (!hitTarget) return; // 시작 전 빈 칸 터치는 무시

      endTimeRef.current = now + GAME_DURATION_MS;
      setStatus('PLAYING');
      statusRef.current = 'PLAYING';
      setTimeLeftMs(GAME_DURATION_MS);

      // 첫 클릭 성공
      const nextCombo = 1;
      setCombo(nextCombo);
      setMaxCombo(1);
      setHits(1);
      setTotalClicks(1);
      setScore(100);
      scoreRef.current = 100;
      gridShotSound.playHit(nextCombo, false, false);
      spawnEffect(cellIndex, '+100', 'cyan');

      // 나머지 2개 초기 타겟의 spawnedAt을 시작 시점으로 세팅 + 새 타겟 교체
      setTargets((prev) => {
        const remaining = prev
          .filter((t) => t.id !== hitTarget.id)
          .map((t) => ({ ...t, spawnedAt: now }));
        const replacement = spawnReplacementTarget(remaining, true);
        return replacement ? [...remaining, replacement] : remaining;
      });
      return;
    }

    // 2. 게임 진행 중(PLAYING) 처리
    const isBurning = endTimeRef.current - now <= 5000;
    const multiplier = isBurning ? 2 : 1;

    setTotalClicks((prev) => prev + 1);

    // A. 빈 공간 클릭 (MISS)
    if (!hitTarget) {
      gridShotSound.playMiss();
      setCombo(0);
      setScore((prev) => {
        const next = Math.max(0, prev - 50);
        scoreRef.current = next;
        return next;
      });
      spawnEffect(cellIndex, 'MISS -50', 'miss');
      return;
    }

    // B. 레드 폭탄 타겟 클릭 (함정!)
    if (hitTarget.type === 'bomb') {
      const pendingTid = bombTimeoutsRef.current.get(hitTarget.id);
      if (pendingTid) {
        clearTimeout(pendingTid);
        bombTimeoutsRef.current.delete(hitTarget.id);
      }

      gridShotSound.playBomb();
      triggerBoardShake();
      setCombo(0);
      setScore((prev) => {
        const next = Math.max(0, prev - 200);
        scoreRef.current = next;
        return next;
      });
      spawnEffect(cellIndex, 'BOMB -200', 'bomb');

      setTargets((prev) => {
        const remaining = prev.filter((t) => t.id !== hitTarget.id);
        const replacement = spawnReplacementTarget(remaining, true);
        return replacement ? [...remaining, replacement] : remaining;
      });
      return;
    }

    // C. 일반 또는 골드 타겟 명중!
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setMaxCombo((prev) => Math.max(prev, nextCombo));
    setHits((prev) => prev + 1);

    // 반응 속도 기록 (생성 시점 ~ 파괴 시점)
    if (hitTarget.spawnedAt !== null) {
      const reaction = Math.max(40, Math.round(now - hitTarget.spawnedAt));
      setReactionTimes((prev) => [...prev, reaction]);
    }

    const isGold = hitTarget.type === 'gold';
    const basePts = isGold ? 300 : 100;
    const comboBonus = Math.min(nextCombo - 1, 50) * 10;
    const gained = (basePts + comboBonus) * multiplier;

    setScore((prev) => {
      const next = prev + gained;
      scoreRef.current = next;
      return next;
    });

    if (isGold) {
      endTimeRef.current += 500;
      setBonusMsTotal((prev) => prev + 500);
      setTimeBonusPopId((prev) => prev + 1);
      spawnEffect(cellIndex, `+${gained} / +0.5s`, 'gold');
    } else {
      const variant = nextCombo >= 30 ? 'gold' : nextCombo >= 10 ? 'purple' : 'cyan';
      spawnEffect(cellIndex, `+${gained}`, variant);
    }

    gridShotSound.playHit(nextCombo, isGold, isBurning);

    // 타겟 즉시 교체
    setTargets((prev) => {
      const remaining = prev.filter((t) => t.id !== hitTarget.id);
      const replacement = spawnReplacementTarget(remaining, true);
      return replacement ? [...remaining, replacement] : remaining;
    });
  };

  // 현재 피버 등급 색상 판정
  const isBurning = status === 'PLAYING' && timeLeftMs <= 5000;
  const feverTier = combo >= 30 ? 'gold' : combo >= 10 ? 'purple' : 'cyan';

  const boardBorderClass = isBurning
    ? 'border-rose-500 shadow-[0_0_28px_rgba(244,63,94,0.45)] animate-gs-burning'
    : feverTier === 'gold'
    ? 'border-amber-400/80 shadow-[0_0_22px_rgba(251,191,36,0.28)]'
    : feverTier === 'purple'
    ? 'border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
    : 'border-cyan-500/40 shadow-[0_0_16px_rgba(6,182,212,0.15)]';

  // 결과 통계 계산
  const totalPlaySec = (GAME_DURATION_MS + bonusMsTotal) / 1000;
  const cps = totalPlaySec > 0 ? (hits / totalPlaySec).toFixed(2) : '0.00';
  const accuracy = totalClicks > 0 ? ((hits / totalClicks) * 100).toFixed(1) : '0.0';
  const avgReactionMs =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  const rankResult =
    status === 'FINISHED'
      ? getGridShotRank(score, avgReactionMs, parseFloat(accuracy))
      : null;

  const currentBest = bestScores[gridSize];

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-5 space-y-3.5 select-none relative overflow-hidden">
      {/* 전용 애니메이션 스타일 */}
      <style>{`
        @keyframes gs-shake {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-6px, 2px); }
          40% { transform: translate(6px, -2px); }
          60% { transform: translate(-4px, -2px); }
          80% { transform: translate(4px, 2px); }
        }
        @keyframes gs-spawn {
          0% { transform: scale(0.35); opacity: 0.3; }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes gs-float-up {
          0% { transform: translate(-50%, -40%) scale(0.9); opacity: 1; }
          100% { transform: translate(-50%, -125%) scale(1.1); opacity: 0; }
        }
        @keyframes gs-burst-ring {
          0% { transform: scale(0.5); opacity: 0.9; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes gs-burning-pulse {
          0%, 100% { box-shadow: 0 0 18px rgba(244, 63, 94, 0.35); }
          50% { box-shadow: 0 0 34px rgba(244, 63, 94, 0.75); }
        }
        .animate-gs-shake {
          animation: gs-shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        .animate-gs-spawn {
          animation: gs-spawn 0.14s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-gs-float {
          animation: gs-float-up 0.52s ease-out forwards;
        }
        .animate-gs-burst {
          animation: gs-burst-ring 0.38s ease-out forwards;
        }
        .animate-gs-burning {
          animation: gs-burning-pulse 0.7s ease-in-out infinite;
        }
      `}</style>

      {/* 단독 실행 시에만 상단 타이틀 노출 (시나브로 통합 시 상위 헤더와 중복 방지) */}
      {showHeader && (
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                그리드샷 (Gridshot)
              </h1>
              <p className="text-[11px] text-slate-400">
                사이버 네온 타겟 반응속도 슈팅
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. 상단 모드 선택 + 사운드/리셋 컨트롤 바 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => handleModeChange(3)}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              gridSize === 3
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>3x3 스피드</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange(4)}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              gridSize === 4
                ? 'bg-fuchsia-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>4x4 정밀</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? '소리 켜기' : '사운드 끄기'}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            type="button"
            onClick={() => resetGame(gridSize)}
            title="다시 시작"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 상단 4대 핵심 지표 대시보드 */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {/* 남은 시간 */}
        <div
          className={`rounded-xl p-2 flex flex-col items-center justify-center border relative transition-colors ${
            isBurning
              ? 'bg-rose-950/60 border-rose-500/60'
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mb-0.5">
            <Timer className={`w-3 h-3 ${isBurning ? 'text-rose-400 animate-spin' : 'text-cyan-400'}`} />
            <span>남은 시간</span>
          </div>
          <div
            className={`text-base sm:text-lg font-black tabular-nums leading-none ${
              isBurning ? 'text-rose-400' : 'text-white'
            }`}
          >
            {(timeLeftMs / 1000).toFixed(1)}
            <span className="text-[10px] font-bold text-slate-400 ml-0.5">s</span>
          </div>
          {timeBonusPopId > 0 && (
            <span
              key={timeBonusPopId}
              className="animate-gs-float absolute top-0 left-1/2 text-[10px] font-black text-amber-300 pointer-events-none whitespace-nowrap"
            >
              +0.5s
            </span>
          )}
        </div>

        {/* 현재 점수 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 flex flex-col items-center justify-center">
          <div className="text-[10px] font-semibold text-slate-400 mb-0.5">현재 점수</div>
          <div className="text-base sm:text-lg font-black text-cyan-300 tabular-nums leading-none">
            {score.toLocaleString()}
          </div>
        </div>

        {/* 현재 콤보 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 flex flex-col items-center justify-center">
          <div className="text-[10px] font-semibold text-slate-400 mb-0.5">현재 콤보</div>
          <div
            className={`text-base sm:text-lg font-black tabular-nums leading-none ${
              feverTier === 'gold'
                ? 'text-amber-300'
                : feverTier === 'purple'
                ? 'text-purple-400'
                : 'text-sky-300'
            }`}
          >
            {combo}
            <span className="text-[10px] font-bold text-slate-500 ml-0.5">x</span>
          </div>
        </div>

        {/* 최고 점수 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mb-0.5">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span>최고 점수</span>
          </div>
          <div className="text-base sm:text-lg font-black text-yellow-300 tabular-nums leading-none">
            {currentBest !== null ? currentBest.toLocaleString() : '--'}
          </div>
        </div>
      </div>

      {/* 상태 안내 바 또는 버닝 타임 배너 */}
      {status === 'IDLE' ? (
        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] font-semibold">
          <Crosshair className="w-3.5 h-3.5 shrink-0" />
          <span>첫 번째 타겟을 클릭(터치)하면 15초 카운트다운이 시작됩니다!</span>
        </div>
      ) : isBurning ? (
        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-500/20 border border-rose-500/60 text-rose-300 text-xs font-black animate-pulse">
          <Flame className="w-4 h-4 text-rose-400 fill-current" />
          <span>🔥 BURNING TIME x2 (모든 점수 2배!)</span>
        </div>
      ) : status === 'PLAYING' ? (
        <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
          <span className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                feverTier === 'gold'
                  ? 'bg-amber-400 animate-ping'
                  : feverTier === 'purple'
                  ? 'bg-purple-400 animate-pulse'
                  : 'bg-cyan-400'
              }`}
            />
            {feverTier === 'gold'
              ? 'FEVER MAX (GOLD)'
              : feverTier === 'purple'
              ? 'FEVER MODE (PURPLE)'
              : 'AIM READY'}
          </span>
          <span className="font-mono">
            명중 {hits}회 · 정확도 {accuracy}%
          </span>
        </div>
      ) : null}

      {/* 3. 메인 슈팅 격자판 OR 결과 리포트 */}
      {status !== 'FINISHED' ? (
        <div
          className={`p-2.5 sm:p-3 rounded-2xl bg-slate-950/90 border-2 transition-all duration-150 cursor-crosshair ${boardBorderClass} ${
            boardShake ? 'animate-gs-shake border-rose-500 bg-rose-950/30' : ''
          }`}
        >
          <div
            className={`grid gap-2 sm:gap-2.5 ${
              gridSize === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, cellIdx) => {
              const target = targets.find((t) => t.cellIndex === cellIdx);
              const cellEffects = effects.filter((e) => e.cellIndex === cellIdx);

              // 피버 단계별 일반 타겟 색상
              const normalTargetStyle =
                feverTier === 'gold'
                  ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 border-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.65)]'
                  : feverTier === 'purple'
                  ? 'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-600 border-fuchsia-200 shadow-[0_0_18px_rgba(192,132,252,0.6)]'
                  : 'bg-gradient-to-br from-cyan-300 via-sky-500 to-blue-600 border-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.55)]';

              return (
                <div
                  key={cellIdx}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleCellAction(cellIdx);
                  }}
                  className="aspect-square rounded-xl bg-slate-900/75 border border-slate-800/80 hover:border-slate-700 flex items-center justify-center relative overflow-visible touch-manipulation active:bg-slate-800/60"
                >
                  {/* 타겟 렌더링 */}
                  {target && (
                    <div
                      key={target.id}
                      className={`animate-gs-spawn rounded-full flex items-center justify-center border-2 transition-transform active:scale-90 pointer-events-none ${
                        target.type === 'gold'
                          ? 'w-[54%] h-[54%] bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 border-white shadow-[0_0_22px_rgba(251,191,36,0.9)]'
                          : target.type === 'bomb'
                          ? 'w-[74%] h-[74%] bg-gradient-to-br from-rose-500 via-red-600 to-rose-900 border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.85)] animate-pulse'
                          : `w-[76%] h-[76%] ${normalTargetStyle}`
                      }`}
                    >
                      {target.type === 'gold' ? (
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white drop-shadow" />
                      ) : target.type === 'bomb' ? (
                        <Skull className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow" />
                      ) : (
                        <div className="w-[38%] h-[38%] rounded-full bg-white/85 shadow-inner" />
                      )}
                    </div>
                  )}

                  {/* 타격 파편 링 & 점수 팝업 */}
                  {cellEffects.map((ef) => (
                    <React.Fragment key={ef.id}>
                      {ef.variant !== 'miss' && (
                        <div
                          className={`animate-gs-burst absolute w-[76%] h-[76%] rounded-full border-2 pointer-events-none ${
                            ef.variant === 'bomb'
                              ? 'border-rose-500'
                              : ef.variant === 'gold'
                              ? 'border-amber-300'
                              : ef.variant === 'purple'
                              ? 'border-purple-400'
                              : 'border-cyan-300'
                          }`}
                        />
                      )}
                      <span
                        className={`animate-gs-float absolute top-1/2 left-1/2 font-black text-xs sm:text-sm pointer-events-none whitespace-nowrap z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                          ef.variant === 'miss' || ef.variant === 'bomb'
                            ? 'text-rose-400'
                            : ef.variant === 'gold'
                            ? 'text-amber-300'
                            : ef.variant === 'purple'
                            ? 'text-fuchsia-300'
                            : 'text-cyan-300'
                        }`}
                      >
                        {ef.text}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 4. 프로 게이머식 정밀 피지컬 리포트 결과 화면 */
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-center space-y-4">
          {isNewRecord && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEW RECORD!</span>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {gridSize}x{gridSize} {gridSize === 3 ? '스피드 모드' : '정밀 모드'} 결과 리포트
            </p>
            <div className="text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
              {score.toLocaleString()}
              <span className="text-lg text-cyan-400 ml-1">점</span>
            </div>
            <p className="text-[11px] text-slate-400">
              최고 연속 콤보 <span className="text-cyan-300 font-bold">{maxCombo}회</span> · 총 명중{' '}
              <span className="text-white font-bold">{hits}개</span>
            </p>
          </div>

          {/* 3가지 정밀 순발력 스탯 카드 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>초당 타격수</span>
              </div>
              <div className="text-sm sm:text-base font-black text-cyan-300 tabular-nums">
                {cps}
                <span className="text-[10px] font-normal text-slate-400 ml-0.5">Hits/s</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                <Target className="w-3 h-3 text-emerald-400" />
                <span>정확도</span>
              </div>
              <div className="text-sm sm:text-base font-black text-emerald-300 tabular-nums">
                {accuracy}
                <span className="text-[10px] font-normal text-slate-400 ml-0.5">%</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                <Activity className="w-3 h-3 text-amber-400" />
                <span>평균 반응속도</span>
              </div>
              <div className="text-sm sm:text-base font-black text-amber-300 tabular-nums">
                {avgReactionMs > 0 ? avgReactionMs : '--'}
                <span className="text-[10px] font-normal text-slate-400 ml-0.5">ms</span>
              </div>
            </div>
          </div>

          {/* 한 줄 등급 판정 */}
          {rankResult && (
            <div className={`p-3 rounded-xl border ${rankResult.bgClass} space-y-1`}>
              <div className={`text-base sm:text-lg font-black ${rankResult.colorClass}`}>
                {rankResult.label}
              </div>
              <p className="text-[11px] text-slate-300">{rankResult.desc}</p>
            </div>
          )}

          {/* 다시 도전 버튼 */}
          <button
            type="button"
            onClick={() => resetGame(gridSize)}
            className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-cyan-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 도전</span>
          </button>
        </div>
      )}

      {/* 하단 스페셜 타겟 & 페널티 안내 */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 px-1">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          골드 +300점 &amp; +0.5초
        </span>
        <span className="flex items-center gap-1">
          <Skull className="w-3 h-3 text-rose-400" />
          폭탄 -200점 (1.2초 후 소멸)
        </span>
        <span>빈칸 MISS -50점</span>
      </div>
    </div>
  );
}
