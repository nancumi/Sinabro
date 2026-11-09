import React from 'react';
import { AlertCircle, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Step1Players({
  players,
  setPlayers,
  onNext,
}) {
  const handlePlayerCountChange = (delta) => {
    sound.playClick();
    const newCount = players.length + delta;
    if (newCount < 1 || newCount > 16) return;

    if (delta > 0) {
      setPlayers([...players, `플레이어 ${newCount}`]);
    } else {
      setPlayers(players.slice(0, -1));
    }
  };

  const handlePlayerNameChange = (index, newName) => {
    const updated = [...players];
    updated[index] = newName;
    setPlayers(updated);
  };

  const handleRemovePlayer = (index) => {
    if (players.length <= 1) return;
    sound.playClick();
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);
  };

  const handleProceed = () => {
    sound.playClick();
    // Validate empty player names
    const sanitized = players.map((p, idx) => (p.trim() ? p.trim() : `플레이어 ${idx + 1}`));
    setPlayers(sanitized);
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4 text-[12px]">
      {/* Subtitle & Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase">
            ROULETTE BATTLE
          </span>
          <h2 className="text-[18px] font-black tracking-tight text-white mt-0.5">
            게임 설정
          </h2>
        </div>
      </div>

      {/* Players Counter Header */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-slate-400">
          플레이어 설정 ({players.length}명)
        </label>
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => handlePlayerCountChange(-1)}
            disabled={players.length <= 1}
            aria-label="인원 감소"
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-[12px] font-bold text-white">
            {players.length}
          </span>
          <button
            type="button"
            onClick={() => handlePlayerCountChange(1)}
            disabled={players.length >= 16}
            aria-label="인원 증가"
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Player Name Inputs */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 focus-within:border-indigo-500/80 rounded-xl px-3 py-2 transition-all"
          >
            {/* Number badge */}
            <div className="w-5 h-5 rounded-full bg-slate-700/80 flex items-center justify-center text-indigo-300 text-[11px] font-bold shrink-0">
              {index + 1}
            </div>

            {/* Input */}
            <input
              type="text"
              value={player}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder={`플레이어 ${index + 1}`}
              maxLength={15}
              className="flex-1 bg-transparent text-[12px] font-medium text-slate-100 placeholder-slate-500 focus:outline-none"
            />

            {/* Delete button if more than 1 player */}
            {players.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemovePlayer(index)}
                aria-label={`${player} 삭제`}
                className="text-slate-500 hover:text-rose-400 p-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Main Next Step Button */}
      <button
        type="button"
        onClick={handleProceed}
        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer"
      >
        <span>다음 단계 (룰렛 내용 입력)</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Info Notice Box */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-start gap-2.5">
        <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          참여할 플레이어 인원을 설정하고 다음 단계에서 룰렛 내용을 자유롭게 구성하세요.
        </p>
      </div>
    </div>
  );
}
