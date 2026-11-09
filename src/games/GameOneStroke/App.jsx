'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import PuzzleBoard from './components/PuzzleBoard';
import { getStageData, CLASSIC_STAGES, getShapeFingerprint } from './utils/generator';
import { oneStrokeSound } from './utils/sound';

export default function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [stageData, setStageData] = useState(() => getStageData(1));
  const [isCleared, setIsCleared] = useState(false);
  const [boardKey, setBoardKey] = useState(0); // 보드 강제 리셋용 키
  const [isMuted, setIsMuted] = useState(false);

  // 로컬 스토리지에서 최고 도달 스테이지 로드
  const [maxStageReached, setMaxStageReached] = useState(1);

  // 이전에 거친 도형 지문 캐시 (중복 방지용)
  const seenFingerprints = useRef(new Set());

  // 1. 초기 로컬 스토리지 데이터 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sinabro_one_stroke_stage');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val > 0) {
          setMaxStageReached(val);
          // 이전에 클리어한 단계가 있다면 그 다음 도전 단계부터 시작
          setCurrentStage(val);
        }
      }
      const savedHistory = localStorage.getItem('sinabro_one_stroke_history');
      if (savedHistory) {
        const list = JSON.parse(savedHistory);
        if (Array.isArray(list)) {
          list.forEach((fp) => seenFingerprints.current.add(fp));
        }
      }
    } catch {}
  }, []);

  // 2. 스테이지 변경 시 데이터 갱신 (중복 방지 세트 전달)
  useEffect(() => {
    const data = getStageData(currentStage, seenFingerprints.current);
    if (data.fingerprint) {
      seenFingerprints.current.add(data.fingerprint);
    }
    setStageData(data);
    setIsCleared(false);
    setBoardKey((k) => k + 1);
  }, [currentStage]);

  // 음소거 토글
  const handleToggleMute = () => {
    const muted = oneStrokeSound.toggleMute();
    setIsMuted(muted);
  };

  // 현재 스테이지 다시하기 (그린 선 리셋)
  const handleRestart = useCallback(() => {
    try {
      oneStrokeSound.playReset();
    } catch {}
    setIsCleared(false);
    setBoardKey((k) => k + 1);
  }, []);

  // 다음 스테이지 이동
  const handleNextStage = useCallback(() => {
    try {
      oneStrokeSound.playClick();
    } catch {}
    setIsCleared(false);
    setCurrentStage((s) => s + 1);
  }, []);

  // 이전 스테이지 이동
  const handlePrevStage = useCallback(() => {
    if (currentStage <= 1) return;
    try {
      oneStrokeSound.playClick();
    } catch {}
    setIsCleared(false);
    setCurrentStage((s) => s - 1);
  }, [currentStage]);

  // 스테이지 클리어 처리
  const handleStageClear = useCallback(() => {
    setIsCleared(true);

    // 기록 및 중복 캐시 영구 저장
    if (currentStage >= maxStageReached) {
      const nextMax = currentStage + 1;
      setMaxStageReached(nextMax);
      try {
        localStorage.setItem('sinabro_one_stroke_stage', String(nextMax));
      } catch {}
    }

    try {
      const historyList = Array.from(seenFingerprints.current).slice(-50);
      localStorage.setItem('sinabro_one_stroke_history', JSON.stringify(historyList));
    } catch {}

    // 축하 컨페티 효과
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
      });
    } catch {}
  }, [currentStage, maxStageReached]);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl text-[12px] text-slate-100 flex flex-col items-center select-none">
      {/* 1. 상단 헤더: 프로그램 이름 및 컨트롤러 */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase block">
            ONE STROKE PUZZLE
          </span>
          <h1 className="text-[17px] font-black text-white tracking-tight leading-tight mt-0.5">
            한 붓 그리기
          </h1>
        </div>

        {/* 우측 사운드 & 리셋 버튼 */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer"
            title={isMuted ? '소리 켜기' : '음소거'}
          >
            {isMuted ? <VolumeX size={14} className="text-slate-500" /> : <Volume2 size={14} className="text-sky-400" />}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white transition cursor-pointer"
            title="현재 스테이지 다시 그리기"
          >
            <RotateCcw size={13} className="text-sky-300" />
            <span className="text-[11px] font-medium">다시하기</span>
          </button>
        </div>
      </div>

      {/* 2. 스테이지 내비게이션 & 정보 배지 */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevStage}
            disabled={currentStage <= 1}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer active:scale-95"
            title="이전 스테이지"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/30 text-sky-300">
            <Trophy size={12} className="text-amber-400" />
            <span className="font-extrabold text-[12px] tracking-wide">
              STAGE {currentStage}
            </span>
          </div>
          <button
            type="button"
            onClick={handleNextStage}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer active:scale-95"
            title="다음 스테이지"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 도형 이름 및 선 개수 안내 */}
        <div className="text-right">
          <div className="text-[10px] text-sky-300 font-semibold">{stageData.title || `STAGE ${currentStage}`}</div>
          <div className="text-[11px] text-slate-400">
            연결할 선: <span className="text-white font-bold">{stageData.edges.length}개</span>
          </div>
        </div>
      </div>

      {/* 3. 중앙 퍼즐 보드 메인 영역 */}
      <div className="relative w-full flex items-center justify-center my-1">
        <PuzzleBoard
          key={boardKey}
          stageData={stageData}
          onStageClear={handleStageClear}
          onRestart={handleRestart}
        />

        {/* 클리어 오버레이 모달 */}
        {isCleared && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-2xl p-5 text-center animate-fade-in pointer-events-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-2.5 shadow-[0_0_25px_rgba(52,211,153,0.5)]">
              <CheckCircle2 size={32} />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              STAGE CLEAR!
            </span>
            <h2 className="text-[17px] font-extrabold text-white mt-0.5 mb-1">
              완벽하게 완성했습니다!
            </h2>
            <p className="text-[11px] text-slate-300 mb-4">
              모든 선을 손가락을 떼지 않고 한 번에 이었습니다.
            </p>
            <button
              type="button"
              onClick={handleNextStage}
              className="w-full max-w-[200px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-[12px] shadow-lg shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
            >
              다음 스테이지 도전 →
            </button>
          </div>
        )}
      </div>

      {/* 4. 하단 간결한 팁 안내 */}
      <div className="mt-3 text-center text-[11px] text-slate-400">
        💡 원하는 점을 터치한 후, 손가락을 떼지 않고 선을 따라 드래그하세요!
      </div>
    </div>
  );
}
