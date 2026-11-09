import React, { useState, useEffect, useMemo } from 'react'
import Modal from './Modal'
import SearchInput from './SearchInput'
import Pagination from './Pagination'
import { Calendar, Target, Trash2 } from 'lucide-react'

export default function HistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const loadHistory = () => {
    try {
      const data = JSON.parse(localStorage.getItem('sinabro_game_history') || '[]')
      setHistory(data)
    } catch (e) {
      setHistory([])
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadHistory()
      setCurrentPage(1)
      setSearchQuery('')
    }
  }, [isOpen])

  // 검색 필터링
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history
    const q = searchQuery.toLowerCase()
    return history.filter((item) => {
      const hasWinner = item.winnerName?.toLowerCase().includes(q)
      const hasLoser = item.loserName?.toLowerCase().includes(q)
      const hasPenalty = item.penalty?.toLowerCase().includes(q)
      const hasAnyParticipant = item.rankings?.some((r) =>
        r.name?.toLowerCase().includes(q)
      )
      return hasWinner || hasLoser || hasPenalty || hasAnyParticipant
    })
  }, [history, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / itemsPerPage))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredHistory, currentPage, itemsPerPage])

  const handleClearHistory = () => {
    localStorage.removeItem('sinabro_game_history')
    setHistory([])
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🏆 역대 대결 기록 & 랭킹 히스토리"
      actions={
        <div className="w-full flex items-center justify-between">
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[12px] font-medium transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              기록 전체 삭제
            </button>
          )}
          <div className="ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-[12px] font-medium transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {/* 검색창: 글자 입력 시 X 아이콘 및 클릭 시 초기화+오토포커스 */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="참가자 이름 또는 벌칙 검색..."
        />

        {/* 히스토리 목록 */}
        {filteredHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-[12px]">
            {history.length === 0
              ? '아직 진행된 게임 기록이 없습니다.'
              : '검색 조건과 일치하는 기록이 없습니다.'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-[12px]"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-200">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Target size={11} className="text-rose-500" />
                    목표 {item.targetTime}초
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-amber-600 font-bold">1등: </span>
                    <span className="font-semibold text-slate-800">
                      {item.winnerName}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-1">
                      (오차 {item.winnerDiff}초)
                    </span>
                  </div>
                  {item.loserName && item.participantsCount > 1 && (
                    <div>
                      <span className="text-rose-600 font-bold">벌칙: </span>
                      <span className="font-semibold text-slate-800">
                        {item.loserName}
                      </span>
                    </div>
                  )}
                </div>

                {item.penalty && (
                  <div className="text-[11px] text-slate-600 bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="font-medium text-rose-500">내기 내용:</span> {item.penalty}
                  </div>
                )}
              </div>
            ))}

            {/* 페이지네이션: << < 1 2 3 4 5 > >> 5개 블록 규격 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}
