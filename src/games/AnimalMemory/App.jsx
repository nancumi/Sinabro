'use client';
import React, { useState, useCallback, useRef } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import SetupScreen from './components/SetupScreen';
import GameBoard from './components/GameBoard';
import PlayerTurnBanner from './components/PlayerTurnBanner';
import TurnTransitionModal from './components/TurnTransitionModal';
import GameOverModal from './components/GameOverModal';
import { sound } from './utils/sound';

export default function App() {
  const [screen, setScreen] = useState('SETUP'); // 'SETUP' | 'PLAYING' | 'WINNER'
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [sequence, setSequence] = useState([]); // [animalId1, animalId2, ...]
  const [inputStep, setInputStep] = useState(0); // 현재 턴에서 입력 중인 인덱스

  // 타일 애니메이션 피드백 상태
  const [activeTileId, setActiveTileId] = useState(null);
  const [statusEffect, setStatusEffect] = useState(null);
  const [isInputLocked, setIsInputLocked] = useState(false);

  // 턴 전환 / 탈락 모달 상태
  const [transitionState, setTransitionState] = useState({
    isOpen: false,
    type: 'nextTurn',
    eliminatedPlayer: null,
    nextPlayer: null,
  });

  // 최종 우승자
  const [winner, setWinner] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // 음소거 토글
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // 게임 시작
  const handleStartGame = (initialPlayers) => {
    setPlayers(initialPlayers);
    setCurrentPlayerIndex(0);
    setSequence([]);
    setInputStep(0);
    setWinner(null);
    setScreen('PLAYING');
  };

  // 게임 초기화 (설정 화면으로 복귀)
  const handleRestart = () => {
    setScreen('SETUP');
    setSequence([]);
    setInputStep(0);
    setWinner(null);
    setTransitionState({ isOpen: false, type: 'nextTurn', eliminatedPlayer: null, nextPlayer: null });
  };

  // 다음 생존 플레이어 인덱스 찾기
  const getNextSurvivingPlayerIndex = useCallback(
    (currentIdx, playerList = players) => {
      const total = playerList.length;
      for (let i = 1; i <= total; i++) {
        const nextIdx = (currentIdx + i) % total;
        if (!playerList[nextIdx].isEliminated) {
          return nextIdx;
        }
      }
      return currentIdx;
    },
    [players]
  );

  // 동물 타일 클릭 핸들러
  const handleTileClick = (animalId) => {
    if (isInputLocked || screen !== 'PLAYING') return;

    sound.playTouch(animalId);
    setActiveTileId(animalId);

    // 1. 기존 누적 시퀀스를 따라 누르는 단계
    if (inputStep < sequence.length) {
      const expectedId = sequence[inputStep];

      if (animalId === expectedId) {
        // [정답] 다음 단계로 진행
        sound.playStepSuccess();
        setStatusEffect('correct');
        const nextStep = inputStep + 1;
        setInputStep(nextStep);

        setTimeout(() => {
          setActiveTileId(null);
          setStatusEffect(null);
        }, 160);
      } else {
        // [오답] "땡!" - 해당 플레이어 탈락
        setIsInputLocked(true);
        sound.playWrong();
        setStatusEffect('wrong');

        setTimeout(() => {
          sound.playEliminated();
          const eliminatedPlayer = players[currentPlayerIndex];
          const updatedPlayers = players.map((p, idx) =>
            idx === currentPlayerIndex ? { ...p, isEliminated: true } : p
          );
          setPlayers(updatedPlayers);

          const survivingPlayers = updatedPlayers.filter((p) => !p.isEliminated);

          if (survivingPlayers.length <= 1) {
            // 최후의 1인 우승!
            setWinner(survivingPlayers[0] || eliminatedPlayer);
            setScreen('WINNER');
            setIsInputLocked(false);
          } else {
            // 서바이벌 계속: 다음 생존 플레이어에게 턴 전환
            const nextIdx = getNextSurvivingPlayerIndex(currentPlayerIndex, updatedPlayers);
            setTransitionState({
              isOpen: true,
              type: 'eliminated',
              eliminatedPlayer,
              nextPlayer: updatedPlayers[nextIdx],
            });
            setCurrentPlayerIndex(nextIdx);
            setInputStep(0);
            setIsInputLocked(false);
          }

          setActiveTileId(null);
          setStatusEffect(null);
        }, 650);
      }
    } else {
      // 2. 기존 시퀀스를 모두 맞추고 "새로운 동물 1개 추가" 단계
      setIsInputLocked(true);
      setStatusEffect('added');
      sound.playRoundComplete();

      const newSequence = [...sequence, animalId];
      setSequence(newSequence);

      setTimeout(() => {
        const nextIdx = getNextSurvivingPlayerIndex(currentPlayerIndex, players);
        setTransitionState({
          isOpen: true,
          type: 'nextTurn',
          eliminatedPlayer: null,
          nextPlayer: players[nextIdx],
        });
        setCurrentPlayerIndex(nextIdx);
        setInputStep(0);
        setIsInputLocked(false);
        setActiveTileId(null);
        setStatusEffect(null);
      }, 500);
    }
  };

  // 모달 닫고 다음 플레이어 도전 시작
  const handleProceedNextTurn = () => {
    setTransitionState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl text-[12px] text-slate-100 flex flex-col items-center select-none">
      {/* 1. 상단 공통 헤더 */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase block">
            ANIMAL MEMORY RELAY
          </span>
          <h1 className="text-[17px] font-black text-white tracking-tight leading-tight mt-0.5">
            동물 기억력 릴레이
          </h1>
        </div>

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
            title="게임 설정으로 돌아가기"
          >
            <RotateCcw size={13} className="text-sky-300" />
            <span className="text-[11px] font-medium">재설정</span>
          </button>
        </div>
      </div>

      {/* 2. 화면 분기 */}
      {screen === 'SETUP' && <SetupScreen onStartGame={handleStartGame} />}

      {screen === 'PLAYING' && (
        <div className="w-full flex flex-col items-center">
          {/* 플레이어 턴 상태 배너 */}
          <PlayerTurnBanner
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            sequenceLength={sequence.length}
            inputStep={inputStep}
          />

          {/* 4x4 동물 그리드 보드 */}
          <GameBoard
            onTileClick={handleTileClick}
            disabled={isInputLocked || transitionState.isOpen}
            activeTileId={activeTileId}
            statusEffect={statusEffect}
          />

          {/* 하단 힌트/안내 문구 */}
          <div className="mt-3 text-center text-[11px] text-slate-400">
            {sequence.length === 0 ? (
              <span>💡 첫 번째 동물 1마리를 자유롭게 터치하여 릴레이를 시작하세요!</span>
            ) : inputStep < sequence.length ? (
              <span>💡 앞사람들이 눌렀던 동물들을 순서대로 차례차례 터치하세요!</span>
            ) : (
              <span className="text-amber-300 font-semibold">
                ✨ 완벽합니다! 이제 새로운 동물 1마리를 눌러 순서에 추가하세요!
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. 턴 전환 / 탈락 모달 */}
      <TurnTransitionModal
        isOpen={transitionState.isOpen}
        type={transitionState.type}
        eliminatedPlayer={transitionState.eliminatedPlayer}
        nextPlayer={transitionState.nextPlayer}
        sequenceLength={sequence.length}
        onProceed={handleProceedNextTurn}
      />

      {/* 4. 최후의 1인 우승 모달 */}
      {screen === 'WINNER' && (
        <GameOverModal
          winner={winner}
          sequenceLength={sequence.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
