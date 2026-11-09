import React, { useState } from 'react'
import { Plus, Minus, Trash2, Play, Trophy, AlertCircle, Info } from 'lucide-react'
import Modal from './Modal'

export default function ParticipantSetup({ onStartGame }) {
  // 'first': 1등 뽑기, 'last': 꼴등 뽑기
  const [gameMode, setGameMode] = useState('first')
  const [participants, setParticipants] = useState([
    { id: 1, name: '플레이어 1' },
  ])

  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    title: '',
    message: '',
  })

  const showAlert = (title, message) => {
    setModalInfo({
      isOpen: true,
      title,
      message,
    })
  }

  const handleAdd = () => {
    const nextIdx = participants.length + 1
    setParticipants([
      ...participants,
      { id: Date.now() + Math.random(), name: `플레이어 ${nextIdx}` },
    ])
  }

  const handleRemoveLast = () => {
    if (participants.length <= 1) {
      showAlert('알림', '최소 1명의 참가자가 필요합니다.')
      return
    }
    setParticipants(participants.slice(0, -1))
  }

  const handleRemoveById = (id) => {
    if (participants.length <= 1) {
      showAlert('알림', '최소 1명의 참가자가 필요합니다.')
      return
    }
    setParticipants(participants.filter((p) => p.id !== id))
  }

  const handleNameChange = (id, newName) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, name: newName } : p))
    )
  }

  const handleStart = () => {
    const trimmed = participants.map((p) => ({
      ...p,
      name: p.name.trim(),
    }))

    for (let i = 0; i < trimmed.length; i++) {
      if (!trimmed[i].name) {
        showAlert('확인 필요', `${i + 1}번째 참가자의 이름을 입력해주세요.`)
        return
      }
    }

    const set = new Set(trimmed.map((p) => p.name))
    if (set.size !== trimmed.length) {
      showAlert('중복 안내', '중복된 참가자 이름이 있습니다.')
      return
    }

    onStartGame({
      participants: trimmed,
      gameMode,
    })
  }

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-[12px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-400">
            TIMER BATTLE
          </span>
          <h1 className="text-[18px] font-black tracking-tight text-white mt-0.5">
            게임 설정
          </h1>
        </div>
      </div>

      {/* 게임 모드 선택: 1등 뽑기 vs 꼴등 뽑기 */}
      <div className="space-y-1.5">
        <label className="text-slate-400 font-medium text-[11px] block">
          대결 목표 선택
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setGameMode('first')}
            className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
              gameMode === 'first'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-md shadow-amber-500/10'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Trophy size={15} />
            <span>1등 뽑기</span>
          </button>

          <button
            type="button"
            onClick={() => setGameMode('last')}
            className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
              gameMode === 'last'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-bold shadow-md shadow-rose-500/10'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <AlertCircle size={15} />
            <span>꼴등 뽑기</span>
          </button>
        </div>
      </div>

      {/* 참가자 설정 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pt-1">
          <label className="text-slate-400 font-medium text-[11px]">
            플레이어 설정 ({participants.length}명)
          </label>
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={handleRemoveLast}
              disabled={participants.length <= 1}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                participants.length <= 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="참가자 줄이기"
            >
              <Minus size={14} />
            </button>
            <span className="font-mono font-bold text-indigo-300 text-[12px] px-1.5 min-w-[20px] text-center">
              {participants.length}
            </span>
            <button
              type="button"
              onClick={handleAdd}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="참가자 추가"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* 참가자 목록 */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {participants.map((p, idx) => (
            <div
              key={p.id}
              className="group flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px] shrink-0">
                {idx + 1}
              </div>
              <input
                type="text"
                value={p.name}
                maxLength={12}
                onChange={(e) => handleNameChange(p.id, e.target.value)}
                placeholder={`참가자 ${idx + 1}`}
                className="flex-1 bg-transparent text-white font-medium text-[12px] focus:outline-none placeholder:text-slate-600"
              />
              {participants.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveById(p.id)}
                  className="opacity-60 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="삭제"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 게임 시작 버튼 */}
      <button
        type="button"
        onClick={handleStart}
        className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-[13px] shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Play size={15} fill="currentColor" />
        게임 시작
      </button>

      {/* 게임 메인 화면 하단 설명 */}
      <div className="pt-2 border-t border-slate-800/60">
        <div className="p-3 rounded-2xl bg-slate-800/30 border border-slate-800 flex items-start gap-2.5 text-slate-400 leading-relaxed text-[11px]">
          <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
          <span>
            여러명이서 주어진 시간을 감으로 가장 가깝게 맞추는 게임으로 1등 또는 꼴등을 가릴 수 있다.
          </span>
        </div>
      </div>

      {/* 알림 모달 */}
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
        title={modalInfo.title}
        actions={
          <button
            type="button"
            onClick={() => setModalInfo({ ...modalInfo, isOpen: false })}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-[12px] font-medium transition-colors cursor-pointer"
          >
            확인
          </button>
        }
      >
        <p className="text-[12px] text-slate-700">{modalInfo.message}</p>
      </Modal>
    </div>
  )
}
