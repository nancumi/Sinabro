import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import SearchInput from './SearchInput';
import Pagination from './Pagination';
import { getReactionGrade } from '../utils/gameUtils';
import { Trash2, Trophy, Clock } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, history, onClearHistory }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const ITEMS_PER_PAGE = 5;

  // 검색 필터링
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase().trim();
    return history.filter((item) => {
      const msMatch = `${item.score}ms`.includes(q) || `${item.score}`.includes(q);
      const gradeMatch = item.grade.toLowerCase().includes(q);
      return msMatch || gradeMatch;
    });
  }, [history, searchQuery]);

  // 페이지 계산
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedItems = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredHistory.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHistory, validCurrentPage]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const hour = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${month}/${day} ${hour}:${min}`;
    } catch {
      return '';
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <span className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" />
            반응속도 측정 기록
          </span>
        }
        footer={
          <div className="w-full flex items-center justify-between">
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowConfirmClear(true)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-rose-200 text-rose-900 hover:bg-rose-300 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 size={13} />
                기록 초기화
              </button>
            )}
            <div className="ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors shadow-sm"
              >
                닫기
              </button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          {/* 검색창 */}
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="기록 검색 (예: 치타, 240, 등급명)..."
          />

          {/* 목록 표시 */}
          {paginatedItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-2 text-[12px]">
              <Clock size={28} className="opacity-40" />
              <p>
                {searchQuery ? '검색 결과와 일치하는 기록이 없습니다.' : '아직 측정된 기록이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {paginatedItems.map((item, idx) => {
                const gradeInfo = getReactionGrade(item.score);
                const globalIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-[12px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center text-slate-400 text-[11px] font-mono">
                        #{globalIndex}
                      </span>
                      <span className="text-lg">{gradeInfo.emoji}</span>
                      <div>
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                          <span>{item.score} ms</span>
                          <span className={`text-[11px] px-1.5 py-0.5 rounded border ${gradeInfo.badgeColor}`}>
                            {item.grade}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {formatDate(item.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-2 pt-2 border-t border-slate-800/80">
              <Pagination
                currentPage={validCurrentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* 초기화 확인 모달 (alert 대체) */}
      <Modal
        isOpen={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        title="기록 초기화"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowConfirmClear(false)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors shadow-sm"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => {
                onClearHistory();
                setShowConfirmClear(false);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-rose-200 text-rose-900 hover:bg-rose-300 transition-colors shadow-sm"
            >
              초기화하기
            </button>
          </>
        }
      >
        <p className="text-[12px] text-slate-300 leading-relaxed">
          저장된 모든 반응속도 기록과 최고 기록이 영구적으로 삭제됩니다.<br />
          정말로 초기화하시겠습니까?
        </p>
      </Modal>
    </>
  );
}

