'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Zap,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Timer,
  Target,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { speedSound } from './utils/sound';

const BEST_KEYS = {
  normal: 'speedtouch_best_normal_v1',
  hard: 'speedtouch_best_hard_v1',
};

// 배열 셔플 (Fisher-Yates)
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 초기 숫자 배열 생성 (1~25) 및 하드모드용 예비 풀(26~50)
function createInitialSetup(mode) {
  const firstPool = shuffleArray(Array.from({ length: 25 }, (_, i) => i + 1));
  const secondPool =
    mode === 'hard'
      ? shuffleArray(Array.from({ length: 25 }, (_, i) => i + 26))
      : [];
  return { firstPool, secondPool };
}

// 결과 등급 판정 로직
function getRankGrade(mode, timeSec) {
  if (mode === 'normal') {
    if (timeSec < 10) {
      return {
        label: '⚡ 신의 손',
        colorClass: 'text-amber-300',
        bgClass: 'bg-amber-500/15 border-amber-500/40',
        desc: '인간의 반응속도를 초월한 압도적인 기록입니다!',
      };
    }
    if (timeSec < 15) {
      return {
        label: '🔥 상위 1% 순발력',
        colorClass: 'text-rose-300',
        bgClass: 'bg-rose-500/15 border-rose-500/40',
        desc: '엄청난 동체시력과 빠른 손놀림의 소유자네요!',
      };
    }
    if (timeSec < 20) {
      return {
        label: '👍 평범한 인간',
        colorClass: 'text-sky-300',
        bgClass: 'bg-sky-500/15 border-sky-500/40',
        desc: '준수한 실력입니다! 조금만 더 집중하면 단축 가능!',
      };
    }
    return {
      label: '🐢 거북이',
      colorClass: 'text-emerald-300',
      bgClass: 'bg-emerald-500/15 border-emerald-500/40',
      desc: '손가락 스트레칭 한 번 하고 다시 도전해 보세요!',
    };
  } else {
    // 하드 모드 (1~50)
    if (timeSec < 25) {
      return {
        label: '⚡ 신의 손',
        colorClass: 'text-amber-300',
        bgClass: 'bg-amber-500/15 border-amber-500/40',
        desc: '50개 숫자를 이 속도로 클리어하다니 경이롭습니다!',
      };
    }
    if (timeSec < 35) {
      return {
        label: '🔥 상위 1% 순발력',
        colorClass: 'text-rose-300',
        bgClass: 'bg-rose-500/15 border-rose-500/40',
        desc: '하드 모드에서도 흔들리지 않는 최고의 집중력!',
      };
    }
    if (timeSec < 45) {
      return {
        label: '👍 평범한 인간',
        colorClass: 'text-sky-300',
        bgClass: 'bg-sky-500/15 border-sky-500/40',
        desc: '안정적인 기록입니다! 실수만 줄이면 바로 기록 단축!',
      };
    }
    return {
      label: '🐢 거북이',
      colorClass: 'text-emerald-300',
      bgClass: 'bg-emerald-500/15 border-emerald-500/40',
      desc: '리필되는 숫자를 침착하게 쫓아가 보세요!',
    };
  }
}

export default function App() {
  const [mode, setMode] = useState('normal'); // 'normal' (1~25) | 'hard' (1~50)
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'PLAYING' | 'FINISHED'
  const [grid, setGrid] = useState(() => createInitialSetup('normal').firstPool);
  const [reservePool, setReservePool] = useState([]);
  const [nextTarget, setNextTarget] = useState(1);

  // 타이머 & 페널티 상태
  const [elapsedMs, setElapsedMs] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [bestRecords, setBestRecords] = useState({ normal: null, hard: null });
  const [isNewRecord, setIsNewRecord] = useState(false);

  // 시각적 피드백 상태
  const [errorTileIndex, setErrorTileIndex] = useState(null);
  const [boardFlash, setBoardFlash] = useState(false);
  const [penaltyPopupId, setPenaltyPopupId] = useState(0); // +0.5s 팝업 트리거용
  const [idleHint, setIdleHint] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 정밀 타이머 Refs
  const startTimeRef = useRef(null);
  const penaltyMsRef = useRef(0);
  const rafRef = useRef(null);
  const errorTimerRef = useRef(null);

  const maxTarget = mode === 'normal' ? 25 : 50;

  // 초기 로컬 스토리지 최고 기록 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const nBest = localStorage.getItem(BEST_KEYS.normal);
      const hBest = localStorage.getItem(BEST_KEYS.hard);
      setBestRecords({
        normal: nBest ? parseFloat(nBest) : null,
        hard: hBest ? parseFloat(hBest) : null,
      });
    } catch {
      // ignore storage errors
    }
  }, []);

  // 타이머 루프 (0.01초 단위)
  useEffect(() => {
    if (status !== 'PLAYING') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const updateTimer = () => {
      if (startTimeRef.current !== null) {
        const nowElapsed = performance.now() - startTimeRef.current + penaltyMsRef.current;
        setElapsedMs(nowElapsed);
      }
      rafRef.current = requestAnimationFrame(updateTimer);
    };

    rafRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status]);

  // 게임 리셋 함수
  const resetGame = useCallback((targetMode = mode) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const { firstPool, secondPool } = createInitialSetup(targetMode);
    setGrid(firstPool);
    setReservePool(secondPool);
    setNextTarget(1);
    setStatus('IDLE');
    setElapsedMs(0);
    setMissCount(0);
    setIsNewRecord(false);
    setErrorTileIndex(null);
    setBoardFlash(false);
    setIdleHint(false);
    startTimeRef.current = null;
    penaltyMsRef.current = 0;
  }, [mode]);

  // 모드 변경 핸들러
  const handleModeChange = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    resetGame(newMode);
  };

  // 음소거 토글
  const handleToggleMute = () => {
    const muted = speedSound.toggleMute();
    setIsMuted(muted);
  };

  // 미스 터치 피드백 트리거
  const triggerErrorFeedback = (idx) => {
    setErrorTileIndex(idx);
    setBoardFlash(true);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => {
      setErrorTileIndex(null);
      setBoardFlash(false);
    }, 320);
  };

  // 타일 터치 핸들러
  const handleTileTap = (idx, num) => {
    if (num === null || status === 'FINISHED') return;

    // 1. 대기 상태(IDLE) 처리: 반드시 1을 눌러야 시작
    if (status === 'IDLE') {
      if (num === 1) {
        // 게임 즉시 시작!
        startTimeRef.current = performance.now();
        penaltyMsRef.current = 0;
        setStatus('PLAYING');
        setIdleHint(false);
        speedSound.playTap(1, maxTarget);

        // 1번 타일 처리 (기본모드: 빈칸 / 하드모드: 26~50 중 하나 리필)
        const nextGrid = [...grid];
        if (mode === 'hard' && reservePool.length > 0) {
          const [refillNum, ...restPool] = reservePool;
          nextGrid[idx] = refillNum;
          setReservePool(restPool);
        } else {
          nextGrid[idx] = null;
        }
        setGrid(nextGrid);
        setNextTarget(2);
      } else {
        // 시작 전 다른 숫자를 눌렀을 때는 패널티 없이 안내만
        speedSound.playError();
        triggerErrorFeedback(idx);
        setIdleHint(true);
      }
      return;
    }

    // 2. 진행 중(PLAYING) 처리
    if (num === nextTarget) {
      // [정답 터치]
      speedSound.playTap(num, maxTarget);

      const nextGrid = [...grid];
      if (mode === 'hard' && num <= 25 && reservePool.length > 0) {
        const [refillNum, ...restPool] = reservePool;
        nextGrid[idx] = refillNum;
        setReservePool(restPool);
      } else {
        nextGrid[idx] = null;
      }
      setGrid(nextGrid);

      // 마지막 숫자 도달 시 즉시 게임 종료!
      if (num === maxTarget) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const finalMs = performance.now() - startTimeRef.current + penaltyMsRef.current;
        setElapsedMs(finalMs);
        setStatus('FINISHED');
        speedSound.playWin();

        const finalSec = parseFloat((finalMs / 1000).toFixed(2));
        const currentBest = bestRecords[mode];

        if (currentBest === null || finalSec < currentBest) {
          setIsNewRecord(true);
          const updatedBest = { ...bestRecords, [mode]: finalSec };
          setBestRecords(updatedBest);
          try {
            localStorage.setItem(BEST_KEYS[mode], String(finalSec));
          } catch {
            // ignore
          }
          // 신기록 축하 콘페티
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.6 },
          });
        }
      } else {
        setNextTarget(num + 1);
      }
    } else {
      // [미스 터치] +0.5초 페널티 적용
      speedSound.playError();
      penaltyMsRef.current += 500;
      setMissCount((prev) => prev + 1);
      setPenaltyPopupId((prev) => prev + 1);
      if (startTimeRef.current !== null) {
        setElapsedMs(performance.now() - startTimeRef.current + penaltyMsRef.current);
      }
      triggerErrorFeedback(idx);
    }
  };

  const formattedTime = (elapsedMs / 1000).toFixed(2);
  const currentBest = bestRecords[mode];
  const grade = status === 'FINISHED' ? getRankGrade(mode, parseFloat(formattedTime)) : null;

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-5 space-y-4 select-none relative overflow-hidden">
      {/* 흔들림 & 팝업 애니메이션 CSS */}
      <style>{`
        @keyframes speedtouch-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px) rotate(-1deg); }
          40% { transform: translateX(5px) rotate(1deg); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes speedtouch-penalty-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-22px) scale(1.15); }
        }
        @keyframes speedtouch-refill-pop {
          0% { transform: scale(0.75); opacity: 0.5; }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-st-shake {
          animation: speedtouch-shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        .animate-st-penalty {
          animation: speedtouch-penalty-float 0.75s ease-out forwards;
        }
        .animate-st-pop {
          animation: speedtouch-refill-pop 0.18s ease-out;
        }
      `}</style>

      {/* 1. 상단 모드 선택 및 제어 바 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => handleModeChange('normal')}
            className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'normal'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>기본 모드</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'normal' ? 'bg-sky-500/40 text-sky-100' : 'bg-slate-800 text-slate-400'}`}>
              1~25
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('hard')}
            className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'hard'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>하드 모드</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${mode === 'hard' ? 'bg-purple-500/40 text-purple-100' : 'bg-slate-800 text-slate-400'}`}>
              1~50
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? '소리 켜기' : '음소거'}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>
          <button
            type="button"
            onClick={() => resetGame(mode)}
            title="다시 배치 (리셋)"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. 상단 대시보드 (다음 숫자 / 현재 시간 / 최고 기록) */}
      <div className="grid grid-cols-3 gap-2">
        {/* 다음 숫자 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mb-0.5">
            <Target className="w-3 h-3 text-sky-400" />
            <span>다음 숫자</span>
          </div>
          <div className="text-2xl font-black text-sky-400 tabular-nums leading-none">
            {status === 'FINISHED' ? '완료' : nextTarget}
          </div>
        </div>

        {/* 현재 시간 (0.00s) + 미스 페널티 팝업 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center justify-center relative">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mb-0.5">
            <Timer className="w-3 h-3 text-amber-400" />
            <span>현재 시간</span>
          </div>
          <div className={`text-xl sm:text-2xl font-black tabular-nums leading-none ${boardFlash ? 'text-rose-400' : 'text-white'}`}>
            {formattedTime}
            <span className="text-xs font-bold text-slate-400 ml-0.5">s</span>
          </div>

          {/* +0.5s 페널티 플로팅 텍스트 */}
          {penaltyPopupId > 0 && (
            <span
              key={penaltyPopupId}
              className="animate-st-penalty absolute top-1 right-2 text-[11px] font-black text-rose-400 pointer-events-none"
            >
              +0.5s
            </span>
          )}
        </div>

        {/* 최고 기록 (Best) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mb-0.5">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span>최고 기록</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-yellow-300 tabular-nums leading-none">
            {currentBest !== null ? (
              <>
                {currentBest.toFixed(2)}
                <span className="text-xs font-bold text-yellow-500/80 ml-0.5">s</span>
              </>
            ) : (
              <span className="text-slate-600 text-base">--.--</span>
            )}
          </div>
        </div>
      </div>

      {/* 시작 안내 또는 진행 바 */}
      {status === 'IDLE' ? (
        <div
          className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-semibold border transition-colors ${
            idleHint
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              : 'bg-sky-500/10 border-sky-500/20 text-sky-300'
          }`}
        >
          {idleHint ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>숫자 &apos;1&apos;을 먼저 터치해야 게임이 시작됩니다!</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>격자판에서 숫자 &apos;1&apos;을 터치하면 즉시 타이머가 작동합니다</span>
            </>
          )}
        </div>
      ) : status === 'PLAYING' ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
            <span>진행률 ({nextTarget - 1} / {maxTarget})</span>
            {missCount > 0 && (
              <span className="text-rose-400 font-semibold">
                실수 {missCount}회 (+{(missCount * 0.5).toFixed(1)}초)
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                mode === 'hard' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-sky-500 to-cyan-400'
              }`}
              style={{ width: `${((nextTarget - 1) / maxTarget) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      {/* 4. 메인 5x5 게임 그리드 OR 결과 화면 */}
      {status !== 'FINISHED' ? (
        <div
          className={`p-2 rounded-2xl border transition-all duration-150 ${
            boardFlash
              ? 'bg-rose-950/30 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-st-shake'
              : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {grid.map((num, idx) => {
              const isEmpty = num === null;
              const isError = errorTileIndex === idx;
              const isSecondWave = num !== null && num > 25;

              if (isEmpty) {
                return (
                  <div
                    key={idx}
                    className="aspect-square rounded-xl bg-slate-900/40 border border-slate-800/30 transition-all"
                  />
                );
              }

              return (
                <button
                  key={`${idx}-${num}`}
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleTileTap(idx, num);
                  }}
                  className={`aspect-square rounded-xl font-black text-lg sm:text-xl flex items-center justify-center border transition-all cursor-pointer active:scale-90 touch-manipulation ${
                    isError
                      ? 'bg-rose-600 border-rose-400 text-white animate-st-shake shadow-lg shadow-rose-900/50'
                      : isSecondWave
                      ? 'animate-st-pop bg-purple-950/60 hover:bg-purple-900/70 border-purple-500/40 text-purple-200 shadow-inner'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/80 hover:border-sky-500/50 text-slate-100 shadow-sm'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 5. 게임 종료 결과 화면 */
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 text-center space-y-4">
          {isNewRecord && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEW RECORD!</span>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {mode === 'normal' ? '기본 모드 (1~25) 완료' : '하드 모드 (1~50) 완료'}
            </p>
            <div className="text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
              {formattedTime}
              <span className="text-xl text-sky-400 ml-1">초</span>
            </div>
            {missCount > 0 ? (
              <p className="text-xs text-rose-400 font-medium">
                미스 터치 {missCount}회 (페널티 +{(missCount * 0.5).toFixed(1)}초 포함)
              </p>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold">
                ✨ 노미스 퍼펙트 클리어!
              </p>
            )}
          </div>

          {/* 재미있는 한 줄 등급 판정 카드 */}
          {grade && (
            <div className={`p-3.5 rounded-xl border ${grade.bgClass} space-y-1`}>
              <div className={`text-lg font-black ${grade.colorClass}`}>
                {grade.label}
              </div>
              <p className="text-[11px] text-slate-300">{grade.desc}</p>
            </div>
          )}

          {/* 다시 하기 버튼 */}
          <button
            type="button"
            onClick={() => resetGame(mode)}
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-sky-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 하기</span>
          </button>
        </div>
      )}

      {/* 하단 간단 룰 안내 */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 px-1">
        <span>오답 터치 시 +0.5초 페널티</span>
        <span>최고 기록은 기기에 자동 저장됩니다</span>
      </div>
    </div>
  );
}
