import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCw,
  Award,
  ListOrdered,
  Flame,
} from 'lucide-react';
import RouletteCanvas from './RouletteCanvas';
import { sound } from '../utils/sound';

export default function Step3RouletteGame({
  players,
  items,
  onRestartAll,
}) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [playerResults, setPlayerResults] = useState([]); // [{ player, result, color }]
  const [showFinalSummary, setShowFinalSummary] = useState(false);

  // References for animation
  const animFrameRef = useRef(null);
  const rotationRef = useRef(0);
  const isSpinningRef = useRef(false);

  // Sync ref
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const currentPlayer = players[currentPlayerIndex];
  const isAllCompleted = playerResults.length === players.length && players.length > 0;

  // Sound tick callback
  const handlePointerTick = useCallback(() => {
    sound.playTick();
  }, []);

  // Spin the wheel
  const handleSpin = () => {
    if (isSpinningRef.current || isAllCompleted) return;

    sound.playWhoosh();
    isSpinningRef.current = true;
    setIsSpinning(true);

    const totalItems = items.length;
    const arcAngle = (2 * Math.PI) / totalItems;
    const randomIndex = Math.floor(Math.random() * totalItems);

    const extraRotations = 6 + Math.floor(Math.random() * 4); // 6 to 9 full turns
    const targetOffset = randomIndex * arcAngle + arcAngle * (0.2 + Math.random() * 0.6);
    const targetFinalRotation =
      rotationRef.current +
      extraRotations * 2 * Math.PI +
      (2 * Math.PI - ((rotationRef.current + targetOffset + Math.PI / 2) % (2 * Math.PI)));

    const startRotation = rotationRef.current;
    const totalDelta = targetFinalRotation - startRotation;
    const duration = 4500 + Math.random() * 1000;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentRot = startRotation + totalDelta * easeOut;

      rotationRef.current = currentRot;
      setRotation(currentRot);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        isSpinningRef.current = false;
        setIsSpinning(false);

        const normalized =
          ((-currentRot - Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const winIndex = Math.floor(normalized / arcAngle) % totalItems;
        const winItem = items[winIndex];

        sound.playWin();
        triggerConfetti();

        const resultEntry = {
          player: currentPlayer,
          result: winItem.text,
          color: winItem.color,
        };

        // Record current player result
        setPlayerResults((prev) => [...prev, resultEntry]);

        // Auto advance to next player without blocking modal
        if (currentPlayerIndex + 1 < players.length) {
          setCurrentPlayerIndex((prev) => prev + 1);
        } else {
          // All completed -> show final summary modal after short celebration
          setTimeout(() => {
            setShowFinalSummary(true);
          }, 800);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#6366f1', '#f59e0b', '#ec4899', '#10b981', '#ffffff'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch {
      // ignore
    }
  };

  // Restart same roulette (keep players & items, reset spin progress)
  const handleRestartSameRoulette = () => {
    sound.playClick();
    setCurrentPlayerIndex(0);
    setPlayerResults([]);
    setShowFinalSummary(false);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto space-y-3 text-[12px]">
      {/* Turn Banner Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 mb-0.5">
              <Flame className="w-3.5 h-3.5" />
              <span>시나브로 룰렛</span>
            </div>
            <div className="text-[12px] text-slate-400">
              진행 상황:{' '}
              <span className="text-white font-bold">
                {Math.min(currentPlayerIndex + (isAllCompleted ? 0 : 1), players.length)} / {players.length}명
              </span>
            </div>
          </div>

          {/* Current Turn Badge */}
          {!isAllCompleted ? (
            <div className="bg-indigo-950/60 border border-indigo-500/40 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-bold text-indigo-200">
                <span className="text-white font-extrabold">{currentPlayer}</span> 님의 차례
              </span>
            </div>
          ) : (
            <button
              onClick={() => setShowFinalSummary(true)}
              className="bg-amber-500/20 border border-amber-400/60 text-amber-300 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 hover:bg-amber-500/30 transition cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>최종 결과 보기</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Roulette Wheel Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 shadow-2xl flex flex-col items-center relative">
        {/* Roulette interactive canvas */}
        <div
          onClick={!isSpinning && !isAllCompleted ? handleSpin : undefined}
          className={`w-full flex items-center justify-center cursor-pointer transition-transform ${
            !isSpinning && !isAllCompleted ? 'hover:scale-[1.01] active:scale-95' : ''
          }`}
          title={isSpinning ? '회전 중...' : '룰렛을 눌러 돌리기'}
        >
          <RouletteCanvas
            items={items}
            rotation={rotation}
            isSpinning={isSpinning}
            onPointerTick={handlePointerTick}
            size={320}
          />
        </div>

        {/* Spin Action Button */}
        <div className="w-full mt-2">
          {!isAllCompleted ? (
            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpin}
              className={`w-full py-3 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2 shadow-md transition-all duration-200 cursor-pointer ${
                isSpinning
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30 cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.98]'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>
                {isSpinning
                  ? '룰렛이 돌아가는 중...'
                  : `${currentPlayer} 님 룰렛 돌리기!`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowFinalSummary(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-md transition active:scale-[0.98] cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>모든 턴 종료! 최종 결과 확인</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Results Progress Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              플레이어별 룰렛 결과
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {playerResults.length} / {players.length} 완료
          </span>
        </div>

        <div className="space-y-1.5">
          {players.map((pName, idx) => {
            const hasResult = playerResults[idx];
            const isCurrent = idx === currentPlayerIndex && !isAllCompleted;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                  hasResult
                    ? 'bg-slate-800/60 border-slate-700/60 text-white'
                    : isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                    : 'bg-slate-800/30 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      hasResult
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {hasResult ? '✓' : idx + 1}
                  </div>
                  <span className="text-[12px] font-medium truncate max-w-[120px]">
                    {pName}
                  </span>
                </div>

                <div>
                  {hasResult ? (
                    <span
                      className="px-2 py-0.5 rounded-lg text-[11px] font-bold border border-white/10"
                      style={{
                        backgroundColor: `${hasResult.color}33`,
                        color: '#f8fafc',
                      }}
                    >
                      {hasResult.result}
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[11px] font-bold text-indigo-400 animate-pulse">
                      회전 대기중...
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">대기</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Summary Modal */}
      {showFinalSummary && (
        <div
          onClick={() => {
            setShowFinalSummary(false);
            sound.playClick();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-default"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl relative max-h-[85vh] flex flex-col cursor-default"
          >
            <div className="text-center mb-3">
              <div className="w-9 h-9 mx-auto mb-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                FINAL SUMMARY
              </span>
              <h2 className="text-[16px] font-bold text-white tracking-tight">
                최종 결과 요약
              </h2>
            </div>

            {/* Scrollable Result List */}
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 mb-4 text-[12px]">
              {playerResults.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center border border-amber-500/30">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[12px] text-slate-100">
                      {item.player}
                    </span>
                  </div>

                  <span
                    className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-white border border-white/10"
                    style={{ backgroundColor: item.color || '#4f46e5' }}
                  >
                    {item.result}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowFinalSummary(false);
                  sound.playClick();
                  onRestartAll();
                }}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-[12px] transition cursor-pointer"
              >
                새로운 룰렛 시작
              </button>
              <button
                type="button"
                onClick={handleRestartSameRoulette}
                className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[12px] transition cursor-pointer"
              >
                동일 룰렛 다시하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
