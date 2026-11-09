import React, { useState } from 'react';
import { Users, Play, Sparkles, Brain, Plus, Minus, Info } from 'lucide-react';
import { PLAYER_COLORS } from '../utils/animals';
import { sound } from '../utils/sound';

export default function SetupScreen({ onStartGame }) {
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState([
    '플레이어 1',
    '플레이어 2',
    '플레이어 3',
    '플레이어 4',
    '플레이어 5',
    '플레이어 6',
  ]);

  const handleCountChange = (delta) => {
    sound.playClick();
    setPlayerCount((prev) => {
      const next = prev + delta;
      return Math.max(2, Math.min(6, next));
    });
  };

  const handleNameChange = (index, value) => {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  };

  const handleStart = () => {
    sound.playClick();
    const players = Array.from({ length: playerCount }).map((_, i) => ({
      id: i,
      name: playerNames[i].trim() || `플레이어 ${i + 1}`,
      color: PLAYER_COLORS[i],
      isEliminated: false,
    }));
    onStartGame(players);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 py-2 animate-fade-in select-none">
      {/* 1. 상단 아이콘 및 안내 타이틀 */}
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-sky-500/30 flex items-center justify-center text-2xl mb-2 shadow-[0_0_25px_rgba(56,189,248,0.25)]">
          🦁
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-300 text-[11px] font-semibold mb-1">
          <Brain size={12} className="text-sky-400" />
          <span>파티 암기 서바이벌</span>
        </div>
        <h2 className="text-[19px] font-black text-white tracking-tight">
          동물 기억력 릴레이
        </h2>
        <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
          앞사람이 누른 동물 순서를 똑같이 기억하고 새로운 동물을 1개씩 추가하세요!
        </p>
      </div>

      {/* 2. 플레이어 인원 설정 카드 */}
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-sky-400" />
            <span className="text-[13px] font-bold text-white">참여 인원</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCountChange(-1)}
              disabled={playerCount <= 2}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700/80 flex items-center justify-center text-white active:scale-95 transition cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="text-[16px] font-extrabold text-sky-400 w-8 text-center">
              {playerCount}명
            </span>
            <button
              type="button"
              onClick={() => handleCountChange(1)}
              disabled={playerCount >= 6}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700/80 flex items-center justify-center text-white active:scale-95 transition cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* 플레이어 닉네임 목록 */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {Array.from({ length: playerCount }).map((_, idx) => {
            const color = PLAYER_COLORS[idx];
            return (
              <div
                key={`player-input-${idx}`}
                className={`flex items-center gap-2 p-2 rounded-xl border ${color.bg} ${color.border}`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-slate-950 shrink-0"
                  style={{ backgroundColor: color.hex }}
                >
                  {idx + 1}
                </div>
                <input
                  type="text"
                  maxLength={7}
                  value={playerNames[idx]}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  className="w-full bg-transparent text-[11px] font-medium text-white placeholder-slate-500 focus:outline-none"
                  placeholder={`플레이어 ${idx + 1}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 간단한 룰 요약 */}
      <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1.5">
          <Info size={13} className="text-amber-400" />
          <span>게임 룰 안내</span>
        </div>
        <ul className="space-y-1 text-slate-400 pl-1">
          <li className="flex items-start gap-1.5">
            <span className="text-sky-400 font-bold shrink-0">1.</span>
            <span>첫 번째 플레이어가 동물 1마리를 선택합니다.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-sky-400 font-bold shrink-0">2.</span>
            <span>다음 사람은 앞사람들의 순서를 그대로 누르고, 새 동물 1마리를 추가합니다.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-rose-400 font-bold shrink-0">3.</span>
            <span>순서를 틀리는 즉시 탈락! 최후의 1인이 승리합니다.</span>
          </li>
        </ul>
      </div>

      {/* 4. 시작 버튼 */}
      <button
        type="button"
        onClick={handleStart}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-white font-extrabold text-[13px] shadow-lg shadow-sky-500/25 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2 mt-1"
      >
        <Play size={16} fill="currentColor" />
        <span>게임 시작하기 ({playerCount}인 릴레이)</span>
      </button>
    </div>
  );
}
