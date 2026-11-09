'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Zap, 
  RotateCcw, 
  Trophy, 
  AlertTriangle, 
  Sparkles,
  TrendingDown
} from 'lucide-react';
import { 
  getReactionGrade, 
  getBestScore, 
  saveScore 
} from './utils/gameUtils';
import { reflexSound } from './utils/sound';

// 게임 상태 타입: 'IDLE' | 'WAITING' | 'READY' | 'EARLY' | 'RESULT'
export default function App() {
  const [gameState, setGameState] = useState('IDLE');
  const [reactionTime, setReactionTime] = useState(null);
  const [bestScore, setBestScore] = useState(null);
  const [scoreDiff, setScoreDiff] = useState(null); // 최고기록과의 차이 (ms)
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [isFirstRecord, setIsFirstRecord] = useState(false);

  // 타이머 및 시간 측정 ref
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // 초기 최고기록 로드
  useEffect(() => {
    const loadedBest = getBestScore();
    setBestScore(loadedBest);
  }, []);

  // 게임 시작 로직 (대기 상태로 진입)
  const startGame = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    reflexSound.playWaiting();
    setGameState('WAITING');
    setReactionTime(null);
    setScoreDiff(null);
    setIsNewRecord(false);
    setIsFirstRecord(false);

    // 1초 ~ 5초 사이의 랜덤 딜레이 (1000ms ~ 5000ms)
    const randomDelay = Math.floor(Math.random() * 4000) + 1000;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('READY');
      reflexSound.playSignal();
    }, randomDelay);
  }, []);

  // 화면 터치 / 클릭 핸들러
  const handleScreenInteraction = useCallback((e) => {
    // 버튼 등을 클릭한 경우 제외
    if (e.target.closest('button')) {
      return;
    }

    if (gameState === 'IDLE') {
      startGame();
    } else if (gameState === 'WAITING') {
      // 녹색으로 바뀌기 전에 성급하게 터치 (거짓 출발)
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      reflexSound.playEarly();
      setGameState('EARLY');
    } else if (gameState === 'READY') {
      // 반응속도 측정
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);

      // 점수 저장 및 최고기록 비교
      const saveResult = saveScore(elapsed);

      if (saveResult.prevBest === null) {
        // 첫 번째 기록 등록
        setIsFirstRecord(true);
        setIsNewRecord(true);
        setBestScore(saveResult.bestScore);
        setScoreDiff(0);
        reflexSound.playNewRecord();
      } else if (saveResult.isNewBest) {
        // 신기록 갱신 (이전 최고기록 대비 단축 시간)
        setIsNewRecord(true);
        setScoreDiff(saveResult.prevBest - elapsed); // 양수: 단축된 ms
        setBestScore(saveResult.bestScore);
        reflexSound.playNewRecord();
      } else {
        // 기존 최고기록보다 느림
        setIsNewRecord(false);
        setScoreDiff(elapsed - saveResult.prevBest); // 양수: 초과된 ms
        reflexSound.playSuccess();
      }

      setGameState('RESULT');
    } else if (gameState === 'EARLY' || gameState === 'RESULT') {
      // 재시작
      startGame();
    }
  }, [gameState, startGame]);

  // 배경 색상
  const getScreenStyles = () => {
    switch (gameState) {
      case 'WAITING':
        return 'bg-gradient-to-b from-rose-950 via-red-900 to-amber-950 text-white';
      case 'READY':
        return 'bg-emerald-500 text-slate-950 font-bold transition-colors duration-75';
      case 'EARLY':
        return 'bg-gradient-to-b from-red-950 via-rose-900 to-slate-950 text-white';
      case 'RESULT':
        return 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white';
      case 'IDLE':
      default:
        return 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100';
    }
  };

  const currentGrade = reactionTime !== null ? getReactionGrade(reactionTime) : null;

  return (
    <div
      onClick={handleScreenInteraction}
      className={`w-full min-h-[460px] sm:min-h-[500px] flex flex-col items-center justify-center p-6 select-none cursor-pointer transition-colors duration-200 overflow-hidden rounded-2xl border border-slate-800 shadow-inner ${getScreenStyles()}`}
    >
      <div className="w-full max-w-md flex flex-col items-center justify-center text-center">

        {/* 역대 최고기록 상시 표시 (중앙 상단 뱃지) */}
        <div className="mb-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-[11px] shadow-md backdrop-blur-sm">
          <Trophy size={13} className="text-amber-400" />
          <span className="text-slate-300">역대 최고기록:</span>
          {bestScore !== null ? (
            <span className="font-mono font-bold text-amber-300 text-[12px]">
              {bestScore} ms
            </span>
          ) : (
            <span className="text-slate-500 text-[11px]">기록 없음</span>
          )}
        </div>

        {/* 1. IDLE: 시작 전 화면 */}
        {gameState === 'IDLE' && (
          <div className="flex flex-col items-center gap-4 animate-fade-in w-full">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-950/40 mb-1">
              <Zap size={32} className="fill-sky-400 text-sky-400 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold tracking-wider text-sky-400 uppercase">
                REACTION SPEED TEST
              </span>
              <h1 className="text-[18px] sm:text-[20px] font-black tracking-tight text-white">
                화면을 터치하여 시작하세요!
              </h1>
              <p className="text-slate-300 text-[12px] max-w-sm mx-auto leading-relaxed mt-1">
                시작하면 화면이 대기 상태로 바뀝니다.<br />
                화면이 <strong className="text-emerald-400 font-bold">초록색(GREEN)</strong>으로 바뀌는 순간, 최대한 빠르게 터치하세요!
              </p>
            </div>

            <button
              type="button"
              onClick={startGame}
              className="mt-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[12px] shadow-md shadow-sky-600/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap size={14} />
              테스트 시작하기
            </button>
          </div>
        )}

        {/* 2. WAITING: 준비 대기 상태 (빨강/주황) */}
        {gameState === 'WAITING' && (
          <div className="flex flex-col items-center gap-3 animate-pulse w-full">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-200">
              <span className="inline-block w-4 h-4 rounded-full bg-rose-400 animate-ping" />
            </div>
            <h2 className="text-[20px] sm:text-[22px] font-black tracking-tight text-rose-100">
              준비 중...
            </h2>
            <p className="text-rose-200/90 text-[12px] font-medium">
              초록색으로 변할 때까지 잠시 기다려주세요!
            </p>
            <span className="text-[11px] text-rose-300/80 bg-black/30 px-3 py-1 rounded-full border border-rose-500/20">
              (지금 터치하면 실패합니다)
            </span>
          </div>
        )}

        {/* 3. READY: 초록색 화면 ("지금 터치!") */}
        {gameState === 'READY' && (
          <div className="flex flex-col items-center gap-2 w-full animate-bounce">
            <div className="w-14 h-14 rounded-2xl bg-slate-950/20 border border-slate-950/30 flex items-center justify-center text-slate-950 mb-1">
              <Zap size={32} className="fill-slate-950" />
            </div>
            <h2 className="text-[26px] sm:text-[30px] font-black tracking-tight text-slate-950 uppercase drop-shadow-xs">
              지금 터치!
            </h2>
            <p className="text-slate-950 font-bold text-[13px]">
              지금 즉시 화면을 탭하세요!
            </p>
          </div>
        )}

        {/* 4. EARLY: 너무 일찍 터치 (실패) */}
        {gameState === 'EARLY' && (
          <div className="flex flex-col items-center gap-3 animate-shake w-full">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-1">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="text-[18px] sm:text-[20px] font-black text-rose-400">
                너무 빨랐습니다! (실패)
              </h2>
              <p className="text-slate-300 text-[12px]">
                초록색으로 바뀌기 전에 성급하게 터치하셨습니다.
              </p>
            </div>

            <div className="mt-3 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={startGame}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-200 border border-rose-500/30 font-bold text-[12px] shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={13} />
                다시 시도하기
              </button>
              <p className="text-[11px] text-slate-400">
                (화면 아무 곳이나 터치해도 다시 시작됩니다)
              </p>
            </div>
          </div>
        )}

        {/* 5. RESULT: 반응속도 측정 결과 및 최고기록 비교 */}
        {gameState === 'RESULT' && currentGrade && (
          <div className="flex flex-col items-center gap-3 w-full">
            {/* 최고기록 갱신 여부 및 실시간 비교 알림 */}
            {isFirstRecord ? (
              <div className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 animate-bounce shadow-xs">
                <Sparkles size={12} />
                첫 기록 등록! 역대 최고기록으로 저장되었습니다.
              </div>
            ) : isNewRecord ? (
              <div className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 animate-bounce shadow-xs">
                <Sparkles size={12} />
                🎉 축하합니다! 역대 최고기록 갱신! ({scoreDiff} ms 단축)
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1.5 shadow-xs">
                <TrendingDown size={12} className="text-rose-400" />
                역대 최고기록({bestScore} ms)보다 <span className="font-bold text-rose-300">+{scoreDiff} ms</span> 늦었습니다.
              </div>
            )}

            {/* 측정 시간 */}
            <div className="flex flex-col items-center gap-1 my-1">
              <span className="text-4xl">{currentGrade.emoji}</span>
              <div className="mt-1 text-[34px] sm:text-[38px] font-black tracking-tight text-white font-mono flex items-baseline gap-1.5">
                <span>{reactionTime}</span>
                <span className="text-[15px] text-slate-400 font-sans">ms</span>
              </div>
              <div className={`mt-1 font-bold text-[15px] ${currentGrade.color}`}>
                {currentGrade.title}
              </div>
              <p className="text-slate-300 text-[12px] max-w-xs mt-0.5 leading-relaxed">
                {currentGrade.desc}
              </p>
            </div>

            {/* 재시작 버튼 */}
            <div className="mt-2 flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={startGame}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[12px] shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <RotateCcw size={13} />
                다시 측정하기
              </button>
              <p className="text-[11px] text-slate-400">
                (화면 아무 곳이나 터치해도 다시 시작할 수 있습니다)
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
