'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Settings,
  RotateCcw,
  ArrowLeftRight,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Trophy,
  Edit3,
  Check,
  X,
  Flame,
  Smartphone,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';
import { sbSound } from './utils/sound';

const PRESETS = [
  {
    id: 'table-tennis',
    label: '탁구',
    sub: '11점 · 5세트',
    targetScore: 11,
    targetSetsToWin: 3, // 5판 3선승
    deuce: true,
    serveMode: 'every2',
  },
  {
    id: 'badminton',
    label: '배드민턴',
    sub: '21점 · 3세트',
    targetScore: 21,
    targetSetsToWin: 2, // 3판 2선승
    deuce: true,
    serveMode: 'scoring',
  },
  {
    id: 'jokgu',
    label: '족구',
    sub: '15점 · 3세트',
    targetScore: 15,
    targetSetsToWin: 2, // 3판 2선승
    deuce: true,
    serveMode: 'scoring',
  },
  {
    id: 'free',
    label: '자유 모드',
    sub: '제한 없음',
    targetScore: 0, // 0 = 무제한
    targetSetsToWin: 0,
    deuce: false,
    serveMode: 'scoring',
  },
];

export default function App({ showHeader = false }) {
  // 팀 상태 (좌우 진영 교체 시 색상/이름/점수/세트 통째로 스왑)
  const [leftTeam, setLeftTeam] = useState({
    id: 'home',
    name: 'HOME',
    score: 0,
    sets: 0,
    theme: 'blue',
  });
  const [rightTeam, setRightTeam] = useState({
    id: 'away',
    name: 'AWAY',
    score: 0,
    sets: 0,
    theme: 'red',
  });

  // 경기 규칙 설정 (기본: 11점, 3판 2선승, 듀스 ON)
  const [rules, setRules] = useState({
    presetName: '기본 경기',
    targetScore: 11, // 0이면 제한 없음
    targetSetsToWin: 2, // 1:단판, 2:3판2선승, 3:5판3선승, 4:7판4선승, 0:무제한
    deuce: true,
    serveMode: 'scoring', // 'scoring' | 'every2' | 'manual'
  });

  const [servingSide, setServingSide] = useState('left'); // 'left' | 'right'
  const [currentSet, setCurrentSet] = useState(1);
  const [setLogs, setSetLogs] = useState([]); // [{ setNum, leftName, rightName, leftScore, rightScore, winnerId }]
  const [status, setStatus] = useState('PLAYING'); // 'PLAYING' | 'SET_WON' | 'MATCH_WON'
  const [setWinnerSide, setSetWinnerSide] = useState(null); // 'left' | 'right'

  // Undo 히스토리 스택
  const [history, setHistory] = useState([]);

  // 팀 이름 편집 상태
  const [editingSide, setEditingSide] = useState(null); // 'left' | 'right' | null
  const [editNameValue, setEditNameValue] = useState('');

  // 플립 애니메이션 트리거 & UI 상태
  const [flipKey, setFlipKey] = useState({ left: 0, right: 0 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customScoreInput, setCustomScoreInput] = useState('11');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissPortraitTip, setDismissPortraitTip] = useState(false);

  const containerRef = useRef(null);
  const pointerStartY = useRef({ left: null, right: null });

  // 모바일 세로 모드 감지 및 전체화면 상태 감지
  useEffect(() => {
    const checkLayout = () => {
      if (typeof window !== 'undefined') {
        const isSmall = window.innerWidth < 640;
        const isPortrait = window.innerHeight > window.innerWidth;
        setIsPortraitMobile(isSmall && isPortrait);
      }
    };
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      window.removeEventListener('resize', checkLayout);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // 전체화면 토글
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore fullscreen restrictions
    }
  };

  // 음소거 토글
  const handleToggleMute = () => {
    const muted = sbSound.toggleMute();
    setIsMuted(muted);
  };

  // 히스토리 스냅샷 저장 헬퍼
  const pushHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-29),
      {
        leftTeam: { ...leftTeam },
        rightTeam: { ...rightTeam },
        servingSide,
        currentSet,
        setLogs: [...setLogs],
        status,
        setWinnerSide,
      },
    ]);
  }, [leftTeam, rightTeam, servingSide, currentSet, setLogs, status, setWinnerSide]);

  // 되돌리기 (Undo)
  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    sbSound.playMinus();
    setLeftTeam(last.leftTeam);
    setRightTeam(last.rightTeam);
    setServingSide(last.servingSide);
    setCurrentSet(last.currentSet);
    setSetLogs(last.setLogs);
    setStatus(last.status);
    setSetWinnerSide(last.setWinnerSide);
    setHistory((prev) => prev.slice(0, -1));
  };

  // 진영 교체 (코트 체인지 🔄)
  const handleSwapSides = () => {
    pushHistory();
    setLeftTeam({ ...rightTeam });
    setRightTeam({ ...leftTeam });
    setServingSide((prev) => (prev === 'left' ? 'right' : 'left'));
    if (setWinnerSide) {
      setSetWinnerSide((prev) => (prev === 'left' ? 'right' : 'left'));
    }
  };

  // 세트 승리 여부 판정
  const checkSetWin = (scorerScore, otherScore) => {
    if (!rules.targetScore || rules.targetScore <= 0) return false; // 자유 모드
    if (scorerScore < rules.targetScore) return false;
    if (rules.deuce) {
      return scorerScore - otherScore >= 2;
    }
    return true;
  };

  // 점수 증감 처리 (+1 / -1)
  const handleChangeScore = (side, delta) => {
    if (status !== 'PLAYING') return;

    const target = side === 'left' ? leftTeam : rightTeam;
    const other = side === 'left' ? rightTeam : leftTeam;

    if (delta < 0 && target.score <= 0) return;

    pushHistory();

    const newScore = Math.max(0, target.score + delta);
    const updatedTarget = { ...target, score: newScore };

    // 플립 애니메이션 & 사운드
    if (delta > 0) {
      sbSound.playScore(target.theme === 'blue');
    } else {
      sbSound.playMinus();
    }
    setFlipKey((prev) => ({ ...prev, [side]: prev[side] + 1 }));

    // 서브권 업데이트
    if (delta > 0) {
      if (rules.serveMode === 'scoring') {
        setServingSide(side);
      } else if (rules.serveMode === 'every2') {
        const totalPts = newScore + other.score;
        const isDeuceZone =
          rules.deuce &&
          rules.targetScore > 0 &&
          newScore >= rules.targetScore - 1 &&
          other.score >= rules.targetScore - 1;

        if (isDeuceZone) {
          setServingSide((prev) => (prev === 'left' ? 'right' : 'left'));
        } else if (totalPts % 2 === 0) {
          setServingSide((prev) => (prev === 'left' ? 'right' : 'left'));
        }
      }
    }

    // 승리 체크
    if (delta > 0 && checkSetWin(newScore, other.score)) {
      const wonSets = updatedTarget.sets + 1;
      const winnerTeam = { ...updatedTarget, sets: wonSets };

      if (side === 'left') {
        setLeftTeam(winnerTeam);
      } else {
        setRightTeam(winnerTeam);
      }

      const finalLeftScore = side === 'left' ? newScore : other.score;
      const finalRightScore = side === 'right' ? newScore : other.score;

      setSetLogs((prev) => [
        ...prev,
        {
          setNum: currentSet,
          leftName: leftTeam.name,
          rightName: rightTeam.name,
          leftScore: finalLeftScore,
          rightScore: finalRightScore,
          winnerId: target.id,
          winnerName: target.name,
          winnerTheme: target.theme,
        },
      ]);

      setSetWinnerSide(side);

      // 최종 매치 승리 판정
      if (rules.targetSetsToWin > 0 && wonSets >= rules.targetSetsToWin) {
        setStatus('MATCH_WON');
        sbSound.playMatchWin();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } else {
        setStatus('SET_WON');
        sbSound.playWhistle();
        confetti({ particleCount: 55, spread: 60, origin: { y: 0.65 } });
      }
      return;
    }

    // 일반 점수 업데이트
    if (side === 'left') {
      setLeftTeam(updatedTarget);
    } else {
      setRightTeam(updatedTarget);
    }
  };

  // 다음 세트 시작 (선택적으로 진영 교체 포함)
  const handleStartNextSet = (swapBeforeStart = false) => {
    if (swapBeforeStart) {
      setLeftTeam({ ...rightTeam, score: 0 });
      setRightTeam({ ...leftTeam, score: 0 });
      setServingSide((prev) => (prev === 'left' ? 'right' : 'left'));
    } else {
      setLeftTeam((prev) => ({ ...prev, score: 0 }));
      setRightTeam((prev) => ({ ...prev, score: 0 }));
    }
    setCurrentSet((prev) => prev + 1);
    setStatus('PLAYING');
    setSetWinnerSide(null);
    setHistory([]);
  };

  // 전체 새 경기 리셋
  const handleResetMatch = () => {
    setLeftTeam((prev) => ({ ...prev, score: 0, sets: 0 }));
    setRightTeam((prev) => ({ ...prev, score: 0, sets: 0 }));
    setCurrentSet(1);
    setSetLogs([]);
    setStatus('PLAYING');
    setSetWinnerSide(null);
    setHistory([]);
  };

  // 프리셋 적용
  const applyPreset = (preset) => {
    setRules({
      presetName: preset.label,
      targetScore: preset.targetScore,
      targetSetsToWin: preset.targetSetsToWin,
      deuce: preset.deuce,
      serveMode: preset.serveMode,
    });
    setCustomScoreInput(String(preset.targetScore || 11));
    handleResetMatch();
    setIsSettingsOpen(false);
  };

  // 팀 이름 편집 시작/저장
  const startEditName = (side, currentName) => {
    setEditingSide(side);
    setEditNameValue(currentName);
  };

  const saveEditName = () => {
    if (!editingSide) return;
    const trimmed = editNameValue.trim() || (editingSide === 'left' ? 'HOME' : 'AWAY');
    if (editingSide === 'left') {
      setLeftTeam((prev) => ({ ...prev, name: trimmed }));
    } else {
      setRightTeam((prev) => ({ ...prev, name: trimmed }));
    }
    setEditingSide(null);
  };

  // 듀스 / 세트포인트 / 매치포인트 판정
  const isDeuce =
    status === 'PLAYING' &&
    rules.deuce &&
    rules.targetScore > 0 &&
    leftTeam.score >= rules.targetScore - 1 &&
    rightTeam.score >= rules.targetScore - 1 &&
    leftTeam.score === rightTeam.score;

  const isSetPointFor = (t, other) => {
    if (status !== 'PLAYING' || !rules.targetScore || rules.targetScore <= 0) return false;
    const nextScore = t.score + 1;
    return checkSetWin(nextScore, other.score);
  };

  const leftSetPoint = isSetPointFor(leftTeam, rightTeam);
  const rightSetPoint = isSetPointFor(rightTeam, leftTeam);

  // 점수 카드 렌더 헬퍼
  const renderTeamCard = (team, otherTeam, side, isSetPoint) => {
    const isBlue = team.theme === 'blue';
    const isServing = servingSide === side;
    const isEditing = editingSide === side;

    const cardGradient = isBlue
      ? 'bg-gradient-to-b from-blue-950/95 via-slate-900 to-blue-950/70 border-blue-500/40'
      : 'bg-gradient-to-b from-rose-950/95 via-slate-900 to-rose-950/70 border-rose-500/40';

    const scoreTextColor = isBlue ? 'text-sky-300' : 'text-rose-300';
    const badgeBg = isBlue
      ? 'bg-blue-500/20 border-blue-400/40 text-sky-300'
      : 'bg-rose-500/20 border-rose-400/40 text-rose-300';

    return (
      <div
        onPointerDown={(e) => {
          pointerStartY.current[side] = e.clientY;
        }}
        onPointerUp={(e) => {
          const startY = pointerStartY.current[side];
          pointerStartY.current[side] = null;
          if (startY === null) return;
          const dy = e.clientY - startY;
          if (dy > 42) {
            // 아래로 스와이프 -> -1점
            handleChangeScore(side, -1);
          } else if (Math.abs(dy) < 20) {
            // 카드 본문 터치 -> +1점
            handleChangeScore(side, 1);
          }
        }}
        className={`relative flex-1 rounded-2xl border-2 p-3 sm:p-4 flex flex-col justify-between transition-all cursor-pointer select-none overflow-hidden touch-manipulation active:scale-[0.99] ${cardGradient}`}
      >
        {/* 1. 카드 상단: 팀 이름(수정 가능) + 서브권 배지 */}
        <div className="flex items-center justify-between gap-2 z-10">
          {isEditing ? (
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 flex-1"
            >
              <input
                type="text"
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditName();
                  if (e.key === 'Escape') setEditingSide(null);
                }}
                autoFocus
                maxLength={12}
                className="w-full max-w-[140px] bg-slate-950/90 border border-slate-600 rounded-lg px-2 py-1 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-sky-400"
              />
              <button
                type="button"
                onClick={saveEditName}
                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                startEditName(side, team.name);
              }}
              title="팀 이름 수정"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-700/60 text-white font-black text-sm sm:text-base tracking-tight transition-colors cursor-pointer max-w-[62%]"
            >
              <span className="truncate">{team.name}</span>
              <Edit3 className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          )}

          {/* 서브권 표시 버튼 (터치 시 수동 전환) */}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setServingSide(side);
            }}
            title="터치하여 서브권 전환"
            className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              isServing
                ? 'bg-amber-500/20 border-amber-400/70 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isServing ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
              }`}
            />
            <span>SERVE</span>
          </button>
        </div>

        {/* 2. 중앙 초대형 플립보드 점수 영역 */}
        <div className="relative my-3 sm:my-4 py-4 sm:py-6 rounded-2xl bg-slate-950/85 border border-slate-800/90 shadow-inner flex flex-col items-center justify-center overflow-hidden">
          {/* 아날로그 플립보드 중앙 절개선 */}
          <div className="absolute inset-x-0 top-1/2 h-[2px] bg-slate-900/95 shadow-[0_1px_0_rgba(255,255,255,0.06)] z-10 pointer-events-none" />

          {/* SET POINT / MATCH POINT 표시 */}
          {isSetPoint && (
            <div
              className={`absolute top-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider border z-20 ${badgeBg} animate-pulse`}
            >
              {rules.targetSetsToWin > 0 && team.sets + 1 >= rules.targetSetsToWin
                ? 'MATCH POINT'
                : 'SET POINT'}
            </div>
          )}

          <div
            key={flipKey[side]}
            className={`animate-sb-flip text-6xl sm:text-7xl md:text-8xl font-black tabular-nums leading-none tracking-tighter z-0 ${scoreTextColor}`}
          >
            {team.score}
          </div>
        </div>

        {/* 3. 하단 -1 감점 버튼 & +1 퀵 버튼 */}
        <div className="flex items-center gap-2 z-10">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleChangeScore(side, -1);
            }}
            disabled={team.score <= 0 || status !== 'PLAYING'}
            className="flex-1 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 disabled:opacity-35 border border-slate-700/70 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>1</span>
          </button>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleChangeScore(side, 1);
            }}
            disabled={status !== 'PLAYING'}
            className={`flex-[2] py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 ${
              isBlue
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/50'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/50'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>득점</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-4xl mx-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-3 sm:p-4 space-y-3 select-none relative flex flex-col justify-between ${
        isFullscreen ? 'min-h-screen max-w-none rounded-none p-4 sm:p-6' : ''
      }`}
    >
      {/* 플립 애니메이션 CSS */}
      <style>{`
        @keyframes sb-flip-pop {
          0% { transform: scaleY(0.75) scaleX(1.04); opacity: 0.65; }
          60% { transform: scaleY(1.06) scaleX(0.98); }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; }
        }
        .animate-sb-flip {
          animation: sb-flip-pop 0.16s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {/* 모바일 세로 모드 안내 배너 */}
      {isPortraitMobile && !dismissPortraitTip && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-sky-500/15 border border-sky-500/35 text-sky-200 text-[11px] font-semibold">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-400 shrink-0 rotate-90" />
            <span>스마트폰을 가로로 돌리면 더 크게 볼 수 있습니다 🔄</span>
          </div>
          <button
            type="button"
            onClick={() => setDismissPortraitTip(true)}
            className="p-0.5 text-sky-300 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. 상단 컨트롤 바 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {showHeader && (
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight mr-1">
              디지털 점수판
            </h1>
          )}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/70 text-[11px] sm:text-xs font-bold transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {rules.presetName} ·{' '}
              {rules.targetScore > 0 ? `${rules.targetScore}점` : '자유'} ·{' '}
              {rules.targetSetsToWin > 0
                ? `${rules.targetSetsToWin * 2 - 1}판${rules.targetSetsToWin}선승`
                : '무제한'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? '소리 켜기' : '음소거'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-sky-400" />
            )}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? '전체화면 종료' : '전체화면'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-sky-400" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleResetMatch}
            title="경기 초기화"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 text-[11px] font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">새 경기</span>
          </button>
        </div>
      </div>

      {/* 2. 메인 점수판 보드 (모바일 가로 & 데스크탑: 좌-중-우 3단 / 세로: 상-중-하 반응형) */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch gap-3">
        {/* 좌측 팀 카드 */}
        {renderTeamCard(leftTeam, rightTeam, 'left', leftSetPoint)}

        {/* 중앙 세트 스코어 & 컨트롤 바 */}
        <div className="sm:w-32 md:w-36 flex sm:flex-col items-center justify-between gap-2 bg-slate-950/75 border border-slate-800 rounded-2xl p-2.5 sm:p-3 shrink-0">
          {/* 세트 번호 및 세트 스코어 */}
          <div className="flex sm:flex-col items-center gap-2 sm:gap-1 text-center">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-extrabold text-slate-300 tracking-wider">
              SET {currentSet}
            </span>

            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-2xl sm:text-3xl font-black tabular-nums ${
                  leftTeam.theme === 'blue' ? 'text-sky-400' : 'text-rose-400'
                }`}
              >
                {leftTeam.sets}
              </span>
              <span className="text-slate-600 font-black text-lg">:</span>
              <span
                className={`text-2xl sm:text-3xl font-black tabular-nums ${
                  rightTeam.theme === 'blue' ? 'text-sky-400' : 'text-rose-400'
                }`}
              >
                {rightTeam.sets}
              </span>
            </div>
          </div>

          {/* 듀스 인디케이터 */}
          {isDeuce && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[10px] font-black animate-pulse">
              <Flame className="w-3 h-3 fill-current" />
              <span>DEUCE</span>
            </div>
          )}

          {/* 중앙 기능 버튼 (진영 교체) */}
          <div className="flex sm:flex-col items-center gap-1.5 sm:w-full">
            <button
              type="button"
              onClick={handleSwapSides}
              className="sm:w-full px-2.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="좌우 진영 바꾸기 (코트 체인지)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>진영 교체</span>
            </button>
          </div>
        </div>

        {/* 우측 팀 카드 */}
        {renderTeamCard(rightTeam, leftTeam, 'right', rightSetPoint)}
      </div>

      {/* 3. 세트 기록 요약 푸터 (진행된 세트가 있을 때만 표시) */}
      {setLogs.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-[11px] text-slate-400">
          <span className="font-bold text-slate-500 shrink-0">세트 기록:</span>
          {setLogs.map((log) => (
            <span
              key={log.setNum}
              className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 shrink-0 tabular-nums"
            >
              <strong className="text-slate-300">{log.setNum}세트</strong> {log.leftScore}:{log.rightScore}
            </span>
          ))}
        </div>
      )}

      {/* 4. 세트 종료 오버레이 모달 */}
      {status === 'SET_WON' && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-sky-400">SET {currentSet} 종료</p>
              <h2 className="text-xl font-black text-white">
                {setWinnerSide === 'left' ? leftTeam.name : rightTeam.name} 세트 승리!
              </h2>
              <p className="text-sm font-mono font-bold text-slate-300">
                {leftTeam.score} : {rightTeam.score}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleStartNextSet(true)}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>진영 교체 후 다음 세트 시작</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartNextSet(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              >
                <span>그대로 다음 세트 시작</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 최종 경기 승리 모달 */}
      {status === 'MATCH_WON' && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 rounded-2xl">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 mx-auto animate-bounce">
              <Trophy className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                FINAL WINNER
              </p>
              <h2 className="text-2xl font-black text-white">
                🏆 {setWinnerSide === 'left' ? leftTeam.name : rightTeam.name} 최종 승리!
              </h2>
              <p className="text-base font-black text-sky-300 tabular-nums">
                세트 스코어 {leftTeam.sets} : {rightTeam.sets}
              </p>
            </div>

            {/* 세트별 점수 기록 요약 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1.5 max-h-36 overflow-y-auto text-xs">
              {setLogs.map((log) => (
                <div
                  key={log.setNum}
                  className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/70"
                >
                  <span className="text-slate-400 font-semibold">{log.setNum}세트</span>
                  <span className="font-mono font-bold text-white">
                    {log.leftName} {log.leftScore} : {log.rightScore} {log.rightName}
                  </span>
                  <span className="text-[10px] font-bold text-amber-300">{log.winnerName} 승</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleResetMatch}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>새 경기 시작</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. 경기 규칙 설정 모달 */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-400" />
                <h3 className="font-black text-sm text-white">경기 규칙 설정</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* 종목별 빠른 프리셋 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  종목별 빠른 프리셋 (선택 시 새 경기 시작)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        rules.presetName === p.label
                          ? 'bg-sky-950/60 border-sky-500 text-white'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{p.label}</div>
                      <div className="text-[10px] text-slate-400">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 목표 점수 설정 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">목표 점수</label>
                <div className="flex flex-wrap gap-1.5">
                  {[11, 15, 21, 25].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => {
                        setRules((prev) => ({
                          ...prev,
                          presetName: '사용자 설정',
                          targetScore: pts,
                        }));
                        setCustomScoreInput(String(pts));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                        rules.targetScore === pts
                          ? 'bg-sky-600 border-sky-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {pts}점
                    </button>
                  ))}
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={customScoreInput}
                      onChange={(e) => {
                        setCustomScoreInput(e.target.value);
                        const val = parseInt(e.target.value, 10);
                        if (val > 0) {
                          setRules((prev) => ({
                            ...prev,
                            presetName: '사용자 설정',
                            targetScore: val,
                          }));
                        }
                      }}
                      className="w-12 bg-transparent text-xs font-bold text-white text-center focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400">점</span>
                  </div>
                </div>
              </div>

              {/* 목표 세트 설정 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">목표 세트</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { setsToWin: 1, label: '단판' },
                    { setsToWin: 2, label: '3판 2선승' },
                    { setsToWin: 3, label: '5판 3선승' },
                    { setsToWin: 4, label: '7판 4선승' },
                  ].map((item) => (
                    <button
                      key={item.setsToWin}
                      type="button"
                      onClick={() =>
                        setRules((prev) => ({
                          ...prev,
                          presetName: '사용자 설정',
                          targetSetsToWin: item.setsToWin,
                        }))
                      }
                      className={`py-2 px-2 rounded-lg text-[11px] font-bold border cursor-pointer ${
                        rules.targetSetsToWin === item.setsToWin
                          ? 'bg-sky-600 border-sky-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 듀스 & 서브 규칙 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">듀스(Deuce) 적용</div>
                    <div className="text-[10px] text-slate-400">2점 차 승리 규칙</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setRules((prev) => ({ ...prev, deuce: !prev.deuce }))
                    }
                    className={`px-3 py-1 rounded-full text-xs font-black transition-colors cursor-pointer ${
                      rules.deuce
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {rules.deuce ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-white">서브권 전환</div>
                  <div className="flex gap-1">
                    {[
                      { id: 'scoring', label: '득점팀' },
                      { id: 'every2', label: '2점교대' },
                      { id: 'manual', label: '수동' },
                    ].map((sm) => (
                      <button
                        key={sm.id}
                        type="button"
                        onClick={() =>
                          setRules((prev) => ({ ...prev, serveMode: sm.id }))
                        }
                        className={`flex-1 py-1 rounded text-[10px] font-bold cursor-pointer ${
                          rules.serveMode === sm.id
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {sm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer"
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
