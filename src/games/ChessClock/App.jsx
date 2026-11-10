'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Trophy,
  Edit3,
  Check,
  X,
  Clock,
  FlipVertical2,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { clockSound } from './utils/sound';

const BOARDGAME_PRESETS = [
  { id: '1m', label: '1분', seconds: 60 },
  { id: '2m', label: '2분', seconds: 120 },
  { id: '3m', label: '3분', seconds: 180 },
];

const QUIZ_PRESETS = [
  { id: '10s', label: '10초', seconds: 10 },
  { id: '30s', label: '30초', seconds: 30 },
];

const BONUS_OPTIONS = [0, 1, 2, 3, 5, 10];

// 남은 밀리초 포맷팅 (10초 이상: MM:SS, 10초 미만: SS.d)
function formatClockTime(ms) {
  const safeMs = Math.max(0, ms);
  if (safeMs < 10000) {
    const secs = Math.floor(safeMs / 1000);
    const tenths = Math.floor((safeMs % 1000) / 100);
    return `${String(secs).padStart(2, '0')}.${tenths}`;
  }
  const totalSec = Math.ceil(safeMs / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function App({ showHeader = false }) {
  // 시간 설정 (기본값: 3분, 피셔 보너스 +2초)
  const [baseSeconds, setBaseSeconds] = useState(180);
  const [bonusSeconds, setBonusSeconds] = useState(0);
  const [presetLabel, setPresetLabel] = useState('3분');

  // 게임 진행 상태
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'RUNNING' | 'PAUSED' | 'TIME_OVER'
  const [activeSide, setActiveSide] = useState('bottom'); // 'top' | 'bottom'
  const [winnerSide, setWinnerSide] = useState(null);

  // 플레이어 상태 (상단: Player 2 레드 / 하단: Player 1 블루)
  const [players, setPlayers] = useState({
    top: { name: 'Player 2', timeMs: 180000, moves: 0 },
    bottom: { name: 'Player 1', timeMs: 180000, moves: 0 },
  });

  // UI/편의 상태
  const [isTopFlipped, setIsTopFlipped] = useState(true); // 상단 180도 회전 (기본 ON)
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customMin, setCustomMin] = useState('3');
  const [customSec, setCustomSec] = useState('0');
  const [bonusPopup, setBonusPopup] = useState({ side: null, id: 0 });

  // 이름 편집 상태
  const [editingSide, setEditingSide] = useState(null);
  const [editNameVal, setEditNameVal] = useState('');

  // 정밀 타이밍 Refs
  const containerRef = useRef(null);
  const lastFrameRef = useRef(null);
  const rafRef = useRef(null);
  const playersRef = useRef(players);
  const activeSideRef = useRef(activeSide);
  const statusRef = useRef(status);
  const lastWarningSecRef = useRef(null);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    activeSideRef.current = activeSide;
  }, [activeSide]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // 전체화면 상태 동기화
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

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
      // ignore
    }
  };

  const handleToggleMute = () => {
    const muted = clockSound.toggleMute();
    setIsMuted(muted);
  };

  // 모바일 햅틱 진동 트리거
  const triggerVibrate = (pattern = 35) => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  };

  // 타이머 루프
  useEffect(() => {
    if (status !== 'RUNNING') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }

    lastFrameRef.current = performance.now();

    const tick = (now) => {
      if (statusRef.current !== 'RUNNING') return;
      const delta = now - (lastFrameRef.current || now);
      lastFrameRef.current = now;

      const side = activeSideRef.current;
      const curTime = playersRef.current[side].timeMs;
      const nextTime = Math.max(0, curTime - delta);

      // 10초 미만 초당 틱 경고음
      if (nextTime > 0 && nextTime < 10000) {
        const curWhole = Math.ceil(nextTime / 1000);
        if (lastWarningSecRef.current !== curWhole) {
          lastWarningSecRef.current = curWhole;
          clockSound.playLowTimeTick();
        }
      } else {
        lastWarningSecRef.current = null;
      }

      if (nextTime <= 0) {
        // TIME OVER 발생!
        setPlayers((prev) => ({
          ...prev,
          [side]: { ...prev[side], timeMs: 0 },
        }));
        setStatus('TIME_OVER');
        statusRef.current = 'TIME_OVER';
        const opponent = side === 'top' ? 'bottom' : 'top';
        setWinnerSide(opponent);
        clockSound.playTimeOver();
        triggerVibrate([180, 90, 180]);
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.55 } });
        return;
      }

      setPlayers((prev) => ({
        ...prev,
        [side]: { ...prev[side], timeMs: nextTime },
      }));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status]);

  // 리셋 함수
  const resetClock = useCallback(
    (sec = baseSeconds) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const ms = sec * 1000;
      setStatus('IDLE');
      statusRef.current = 'IDLE';
      setActiveSide('bottom');
      setWinnerSide(null);
      lastWarningSecRef.current = null;
      setPlayers((prev) => ({
        top: { ...prev.top, timeMs: ms, moves: 0 },
        bottom: { ...prev.bottom, timeMs: ms, moves: 0 },
      }));
    },
    [baseSeconds]
  );

  // 중앙 시작 / 일시정지 버튼 핸들러
  const handleStartPause = () => {
    if (status === 'TIME_OVER') {
      resetClock(baseSeconds);
      return;
    }
    if (status === 'RUNNING') {
      setStatus('PAUSED');
      clockSound.playSwitch(false);
    } else {
      lastFrameRef.current = performance.now();
      setStatus('RUNNING');
      clockSound.playSwitch(false);
      triggerVibrate(25);
    }
  };

  // 플레이어 영역 터치 (턴 교체!)
  const handlePlayerTap = (side) => {
    if (status === 'TIME_OVER' || status === 'PAUSED' || editingSide !== null) return;

    // 대기 상태에서 내 영역을 누르면 즉시 대국이 시작되며 상대방 타이머로 넘어감
    if (status === 'IDLE') {
      const opponent = side === 'top' ? 'bottom' : 'top';
      triggerVibrate(35);
      clockSound.playSwitch(side === 'top');
      lastWarningSecRef.current = null;
      setPlayers((prev) => ({
        ...prev,
        [side]: { ...prev[side], moves: prev[side].moves + 1 },
      }));
      setActiveSide(opponent);
      lastFrameRef.current = performance.now();
      setStatus('RUNNING');
      return;
    }

    // 진행 중에는 현재 자기 차례인 플레이어만 버튼을 누를 수 있음
    if (status === 'RUNNING' && activeSide === side) {
      const opponent = side === 'top' ? 'bottom' : 'top';
      triggerVibrate(35);
      clockSound.playSwitch(side === 'top');
      lastWarningSecRef.current = null;

      // 피셔 보너스 적용 (턴을 마친 플레이어에게 +bonusSeconds)
      const bonusMs = bonusSeconds * 1000;
      if (bonusMs > 0) {
        setBonusPopup((prev) => ({ side, id: prev.id + 1 }));
      }

      setPlayers((prev) => ({
        ...prev,
        [side]: {
          ...prev[side],
          timeMs: prev[side].timeMs + bonusMs,
          moves: prev[side].moves + 1,
        },
      }));

      setActiveSide(opponent);
      lastFrameRef.current = performance.now();
    }
  };

  // 프리셋 적용
  const applyPreset = (sec, label) => {
    setBaseSeconds(sec);
    setPresetLabel(label);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    setCustomMin(String(m));
    setCustomSec(String(s));
    resetClock(sec);
    setIsSettingsOpen(false);
  };

  // 커스텀 시간 적용
  const applyCustomTime = () => {
    const m = Math.max(0, parseInt(customMin || '0', 10) || 0);
    const s = Math.max(0, Math.min(59, parseInt(customSec || '0', 10) || 0));
    const total = Math.max(5, m * 60 + s);
    setBaseSeconds(total);
    setPresetLabel(m > 0 ? (s > 0 ? `${m}분 ${s}초` : `${m}분`) : `${s}초`);
    resetClock(total);
    setIsSettingsOpen(false);
  };

  // 이름 편집 시작/저장
  const startEditName = (side, currentName) => {
    setEditingSide(side);
    setEditNameVal(currentName);
  };

  const saveEditName = () => {
    if (!editingSide) return;
    const trimmed =
      editNameVal.trim() || (editingSide === 'top' ? 'Player 2' : 'Player 1');
    setPlayers((prev) => ({
      ...prev,
      [editingSide]: { ...prev[editingSide], name: trimmed },
    }));
    setEditingSide(null);
  };

  // 플레이어 패널 렌더링
  const renderPlayerPad = (side) => {
    const p = players[side];
    const isTop = side === 'top';
    const isActive = status === 'RUNNING' && activeSide === side;
    const isLoser = status === 'TIME_OVER' && p.timeMs <= 0;
    const isLowTime = isActive && p.timeMs > 0 && p.timeMs < 10000;
    const isEditing = editingSide === side;

    const themeClasses = isLoser
      ? 'bg-rose-950/90 border-rose-500 animate-pulse'
      : isActive
      ? isTop
        ? 'bg-gradient-to-b from-rose-950 via-rose-900/60 to-slate-900 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.28)]'
        : 'bg-gradient-to-t from-blue-950 via-blue-900/60 to-slate-900 border-sky-500 shadow-[0_0_30px_rgba(56,189,248,0.28)]'
      : 'bg-slate-950/85 border-slate-800/90 opacity-75';

    const timeColor = isLoser
      ? 'text-rose-400'
      : isLowTime
      ? 'text-rose-400 animate-pulse'
      : isActive
      ? 'text-white'
      : 'text-slate-400';

    return (
      <div
        onPointerDown={() => handlePlayerTap(side)}
        className={`relative flex-1 min-h-[185px] sm:min-h-[210px] rounded-2xl border-2 p-4 flex flex-col justify-between transition-all select-none touch-manipulation overflow-hidden ${
          isActive || status === 'IDLE' ? 'cursor-pointer active:scale-[0.985]' : 'cursor-default'
        } ${themeClasses} ${isTop && isTopFlipped ? 'rotate-180' : ''}`}
      >
        {/* 상단 바: 플레이어 이름(수정 가능) & 턴 수 */}
        <div className="flex items-center justify-between gap-2 z-10">
          {isEditing ? (
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center gap-1"
            >
              <input
                type="text"
                value={editNameVal}
                onChange={(e) => setEditNameVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditName();
                  if (e.key === 'Escape') setEditingSide(null);
                }}
                autoFocus
                maxLength={14}
                className="w-32 bg-slate-950 border border-slate-600 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-sky-400"
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
              onPointerDown={(e) => {
                e.stopPropagation();
                startEditName(side, p.name);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-xs sm:text-sm font-black text-slate-100 cursor-pointer"
              title="플레이어 이름 변경"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isTop ? 'bg-rose-400' : 'bg-sky-400'
                }`}
              />
              <span>{p.name}</span>
              <Edit3 className="w-3 h-3 text-slate-400" />
            </button>
          )}

          <div className="flex items-center gap-2">
            {bonusPopup.side === side && bonusSeconds > 0 && (
              <span
                key={bonusPopup.id}
                className="animate-cc-bonus px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-black"
              >
                +{bonusSeconds}s
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] font-bold text-slate-400 tabular-nums">
              {p.moves}턴
            </span>
          </div>
        </div>

        {/* 중앙 초대형 디지털 시계 */}
        <div className="flex-1 flex flex-col items-center justify-center my-2 relative">
          {isLoser ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-rose-400 font-black text-xl sm:text-2xl tracking-wider">
                <AlertTriangle className="w-6 h-6" />
                <span>TIME OVER</span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-rose-500/80 tabular-nums">
                00.0
              </span>
            </div>
          ) : (
            <>
              <div
                className={`text-6xl sm:text-7xl font-black tabular-nums tracking-tight leading-none ${timeColor}`}
              >
                {formatClockTime(p.timeMs)}
              </div>
              <div className="mt-2 h-5 flex items-center">
                {isActive ? (
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-black tracking-wide border ${
                      isTop
                        ? 'bg-rose-500/20 border-rose-400/50 text-rose-200'
                        : 'bg-sky-500/20 border-sky-400/50 text-sky-200'
                    }`}
                  >
                    내 차례 끝! 터치하여 넘기기
                  </span>
                ) : status === 'IDLE' ? (
                  <span className="text-[11px] text-slate-500 font-medium">
                    터치 시 상대 타이머 즉시 시작
                  </span>
                ) : status === 'PAUSED' && activeSide === side ? (
                  <span className="text-[11px] text-amber-400 font-bold">
                    일시정지됨
                  </span>
                ) : null}
              </div>
            </>
          )}
        </div>

        {/* 하단 진행 바 (남은 시간 비율 시각화) */}
        <div className="w-full h-1.5 bg-slate-900/90 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              isLowTime
                ? 'bg-rose-500'
                : isTop
                ? 'bg-rose-500/80'
                : 'bg-sky-500/80'
            }`}
            style={{
              width: `${Math.min(100, (p.timeMs / Math.max(1, baseSeconds * 1000)) * 100)}%`,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-lg mx-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col gap-2.5 select-none relative overflow-hidden ${
        isFullscreen ? 'min-h-screen max-w-none rounded-none justify-between' : ''
      }`}
    >
      {/* 보너스 팝업 애니메이션 CSS */}
      <style>{`
        @keyframes cc-bonus-pop {
          0% { opacity: 1; transform: translateY(4px) scale(0.9); }
          100% { opacity: 0; transform: translateY(-10px) scale(1.1); }
        }
        .animate-cc-bonus {
          animation: cc-bonus-pop 0.8s ease-out forwards;
        }
      `}</style>

      {/* 단독 실행 시에만 상단 타이틀 노출 (시나브로 통합 시 상위 헤더와 중복 방지) */}
      {showHeader && (
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <h1 className="text-sm sm:text-base font-black text-white">게임 타이머</h1>
          </div>
          <span className="text-[11px] text-slate-400">
            {presetLabel} {bonusSeconds > 0 ? `(+${bonusSeconds}초)` : ''}
          </span>
        </div>
      )}

      {/* 1. 상단 플레이어 영역 (기본 180도 반전) */}
      {renderPlayerPad('top')}

      {/* 2. 중앙 공용 컨트롤 바 */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-2.5 py-2 flex items-center justify-between gap-1.5 z-20">
        {/* 좌측: 시작 / 일시정지 버튼 */}
        <button
          type="button"
          onClick={handleStartPause}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-black text-xs transition-all cursor-pointer active:scale-95 ${
            status === 'RUNNING'
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {status === 'RUNNING' ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>일시정지</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{status === 'PAUSED' ? '재개' : '시작'}</span>
            </>
          )}
        </button>

        {/* 중앙: 현재 시간 규칙 배지 & 설정 버튼 */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/70 text-[11px] font-bold transition-colors cursor-pointer"
          title="시간 및 피셔 보너스 설정"
        >
          <Settings className="w-3.5 h-3.5 text-sky-400" />
          <span>
            {presetLabel}
            {bonusSeconds > 0 ? ` +${bonusSeconds}s` : ''}
          </span>
        </button>

        {/* 우측: 반전 토글, 사운드, 전체화면, 리셋 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsTopFlipped((prev) => !prev)}
            title={isTopFlipped ? '상단 180° 반전 해제 (나란히 보기)' : '상단 180° 반전 켜기 (마주 보기)'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isTopFlipped
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <FlipVertical2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? '소리 켜기' : '음소거'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? '전체화면 종료' : '전체화면'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer hidden sm:inline-flex"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => resetClock(baseSeconds)}
            title="시간 초기화"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* 3. 하단 플레이어 영역 */}
      {renderPlayerPad('bottom')}

      {/* 4. 시간 초과(TIME OVER) 승리 결과 모달 */}
      {status === 'TIME_OVER' && winnerSide && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl">
          <div className="w-full max-w-xs bg-slate-900 border border-amber-500/40 rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 mx-auto animate-bounce">
              <Trophy className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                TIME OVER
              </p>
              <h2 className="text-xl font-black text-white">
                🏆 {players[winnerSide].name} 승리!
              </h2>
              <p className="text-xs text-slate-400">
                남은 시간:{' '}
                <strong className="text-sky-300 tabular-nums">
                  {formatClockTime(players[winnerSide].timeMs)}
                </strong>{' '}
                ({players[winnerSide].moves}턴)
              </p>
            </div>

            <button
              type="button"
              onClick={() => resetClock(baseSeconds)}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 대국하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. 시간 프리셋 & 피셔 보너스 설정 모달 */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="font-black text-sm text-white">대국 시간 및 규칙 설정</h3>
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
              {/* 스피드 보드게임 모드 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  스피드 보드게임 모드 (바둑 / 체스 / 오목)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BOARDGAME_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p.seconds, p.label)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        baseSeconds === p.seconds
                          ? 'bg-sky-600 border-sky-500 text-white'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 스피드 퀴즈 / 밸런스 게임 모드 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  스피드 퀴즈 / 밸런스 게임 모드 (숏 타임)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {QUIZ_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p.seconds, p.label)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        baseSeconds === p.seconds
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 자유 커스텀 시간 입력 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  자유 커스텀 설정
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={customMin}
                      onChange={(e) => setCustomMin(e.target.value)}
                      className="w-12 bg-transparent text-sm font-bold text-white text-center focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">분</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customSec}
                      onChange={(e) => setCustomSec(e.target.value)}
                      className="w-12 bg-transparent text-sm font-bold text-white text-center focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">초</span>
                  </div>
                  <button
                    type="button"
                    onClick={applyCustomTime}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer"
                  >
                    적용하기
                  </button>
                </div>
              </div>

              {/* 피셔 방식 보너스 시간 */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-white block">
                      피셔 방식 (매 턴 보너스 시간)
                    </label>
                    <p className="text-[10px] text-slate-400">
                      버튼을 눌러 턴을 넘길 때마다 시간 추가
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {BONUS_OPTIONS.map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setBonusSeconds(sec)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        bonusSeconds === sec
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {sec === 0 ? '없음' : `+${sec}초`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
