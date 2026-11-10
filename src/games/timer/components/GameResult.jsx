import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Trophy, AlertCircle, RotateCcw } from 'lucide-react'
import { playFanfare } from '../utils/sound'

export default function GameResult({
  results,
  targetTime,
  gameMode = 'first',
  onRestart,
}) {
  // 오차(diff) 기준 오름차순 정렬 (1등 = 최소 오차, 꼴등 = 최대 오차)
  const sorted = [...results].sort((a, b) => a.diff - b.diff)
  const winner = sorted[0]
  const loser = sorted[sorted.length - 1]

  const isFirstMode = gameMode === 'first'
  const highlightTarget = isFirstMode ? winner : loser

  useEffect(() => {
    playFanfare()
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    })
  }, [])

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-[12px]">
      {/* 상단 결과 요약 헤더 */}
      <div className="text-center pb-4 border-b border-slate-800">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-400">
          FINAL RESULT
        </span>
        <h1 className="text-[20px] font-black tracking-tight text-white mt-1">
          {isFirstMode ? '1등 발표' : '꼴등 발표'}
        </h1>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-[11px]">
          <span>목표</span>
          <span className="font-bold text-white">{targetTime}초</span>
        </div>
      </div>

      {/* 하이라이트 카드 (모드에 따라 1등 또는 꼴등 강조) */}
      <div
        className={`relative overflow-hidden p-4 rounded-2xl border flex items-center justify-between ${
          isFirstMode
            ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30'
            : 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              isFirstMode
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}
          >
            {isFirstMode ? <Trophy size={18} /> : <AlertCircle size={18} />}
          </div>
          <div>
            <div
              className={`text-[11px] font-bold uppercase tracking-wide ${
                isFirstMode ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {isFirstMode ? '1등 당첨' : '꼴등 당첨'}
            </div>
            <div className="text-[15px] font-black text-white">
              {highlightTarget?.participant?.name}
            </div>
          </div>
        </div>
        <div className="text-right font-mono">
          <div className="text-[15px] font-bold text-white">
            {highlightTarget?.recordTime.toFixed(2)}초
          </div>
          <div
            className={`text-[11px] ${
              isFirstMode ? 'text-amber-400/90' : 'text-rose-400/90'
            }`}
          >
            오차 {highlightTarget?.diff.toFixed(2)}초
          </div>
        </div>
      </div>

      {/* 전체 순위 리스트 */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        {sorted.map((res, index) => {
          const rank = index + 1
          const isTarget = isFirstMode ? rank === 1 : rank === sorted.length
          return (
            <div
              key={res.participant.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                isTarget
                  ? isFirstMode
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-rose-500/5 border-rose-500/30'
                  : 'bg-slate-800/30 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-[11px]">
                  {rank}
                </span>
                <span className="font-semibold text-white text-[12px]">
                  {res.participant.name}
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-[13px] font-bold text-slate-200">
                  {res.recordTime.toFixed(2)}초
                </span>
                <span className="text-slate-500 text-[11px] ml-2">
                  (오차 {res.diff.toFixed(2)}초)
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 다시하기 버튼 */}
      <button
        type="button"
        onClick={onRestart}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-[13px] shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <RotateCcw size={15} />
        다시하기
      </button>
    </div>
  )
}
