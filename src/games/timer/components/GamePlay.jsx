import React, { useState, useRef } from 'react'
import { Play, Square, ArrowRight, User, Trophy, AlertCircle } from 'lucide-react'
import { playStart, playStop } from '../utils/sound'

export default function GamePlay({
  targetTime,
  participants,
  gameMode,
  onFinishGame,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // 'ready' | 'running' | 'next_turn'
  const [stage, setStage] = useState('ready')
  const [results, setResults] = useState([])

  const startTimeRef = useRef(0)
  const currentParticipant = participants[currentIndex]

  // 시작
  const handleStart = () => {
    startTimeRef.current = performance.now()
    setStage('running')
    playStart()
  }

  // 정지
  const handleStop = () => {
    const endNow = performance.now()
    const rawElapsed = (endNow - startTimeRef.current) / 1000
    // 소수 2자리 계산
    const recordTwoDec = Number(rawElapsed.toFixed(2))
    const diffTwoDec = Number(Math.abs(recordTwoDec - targetTime).toFixed(2))

    playStop()

    const newRecord = {
      participant: currentParticipant,
      recordTime: recordTwoDec,
      targetTime: targetTime,
      diff: diffTwoDec,
    }

    const updatedResults = [...results, newRecord]
    setResults(updatedResults)

    // 마지막 참가자이거나 1인 플레이인 경우: 즉시 최종 결과로 직행
    if (currentIndex + 1 >= participants.length) {
      onFinishGame(updatedResults)
    } else {
      // 다음 참가자가 남아있을 때만 다음 턴 단계로
      setStage('next_turn')
    }
  }

  // 다음 참가자 턴으로 진입
  const handleNextPlayer = () => {
    setCurrentIndex((prev) => prev + 1)
    setStage('ready')
  }

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-[12px]">
      {/* 목표 시간 카드 */}
      <div className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center relative">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            TARGET TIME
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
              gameMode === 'first'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-rose-500/20 text-rose-300'
            }`}
          >
            {gameMode === 'first' ? <Trophy size={10} /> : <AlertCircle size={10} />}
            {gameMode === 'first' ? '1등 뽑기' : '꼴등 뽑기'}
          </span>
        </div>
        <div className="text-[52px] font-black tracking-tight text-white leading-none">
          {targetTime}
          <span className="text-[20px] font-bold text-indigo-400 ml-1">초</span>
        </div>
      </div>

      {/* 현재 참가자 표시 & 순서 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 font-bold text-white text-[13px]">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <User size={13} />
          </div>
          <span>{currentParticipant.name} 님의 차례</span>
        </div>
        {participants.length > 1 && (
          <span className="font-mono text-slate-500 text-[11px]">
            {currentIndex + 1} / {participants.length}
          </span>
        )}
      </div>

      {/* 게임 인터랙션 화면 (오직 스피너만 돌아가도록 구현) */}
      <div className="h-44 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
        {stage === 'ready' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
              <Play size={20} fill="currentColor" />
            </div>
            <span className="text-slate-400 font-medium text-[12px]">
              시작 버튼을 눌러주세요
            </span>
          </div>
        )}

        {stage === 'running' && (
          <div className="flex items-center justify-center">
            {/* 아무런 텍스트 없이 오직 스피너만 회전 */}
            <div className="w-11 h-11 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          </div>
        )}

        {stage === 'next_turn' && (
          <div className="text-center space-y-1">
            <span className="text-emerald-400 font-bold text-[14px]">
              기록 저장 완료!
            </span>
            <p className="text-slate-300 text-[12px]">
              다음 참가자: <span className="font-bold text-white">{participants[currentIndex + 1]?.name}</span>
            </p>
          </div>
        )}
      </div>

      {/* 조작 버튼 */}
      <div>
        {stage === 'ready' && (
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-[13px] shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play size={15} fill="currentColor" />
            시작
          </button>
        )}

        {stage === 'running' && (
          <button
            type="button"
            onClick={handleStop}
            className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white font-bold text-[13px] shadow-lg shadow-rose-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Square size={15} fill="currentColor" />
            정지
          </button>
        )}

        {stage === 'next_turn' && (
          <button
            type="button"
            onClick={handleNextPlayer}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-[13px] shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>다음 참가자 차례 ({participants[currentIndex + 1]?.name})</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
