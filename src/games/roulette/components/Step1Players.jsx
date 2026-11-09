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
    <div className="w-full max-w-md mx-auto bg-dark-700/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-dark-border shadow-glow-card">
      {/* Subtitle & Title */}
      <div className="mb-6">
        <span className="text-[11px] font-extrabold tracking-widest text-indigo-400 uppercase">
          ROULETTE BATTLE
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
          게임 설정
        </h2>
      </div>

      <div className="border-t border-dark-border/60 mb-6"></div>

      {/* Players Counter Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold text-slate-200">
          플레이어 설정 ({players.length}명)
        </label>
        <div className="flex items-center bg-dark-800 border border-dark-border rounded-xl px-1.5 py-1">
          <button
            type="button"
            onClick={() => handlePlayerCountChange(-1)}
            disabled={players.length <= 1}
            aria-label="인원 감소"
            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-dark-700 transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-bold text-white">
            {players.length}
          </span>
          <button
            type="button"
            onClick={() => handlePlayerCountChange(1)}
            disabled={players.length >= 16}
            aria-label="인원 증가"
            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-dark-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Player Name Inputs */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 mb-6">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 bg-dark-input/90 border border-dark-border/80 focus-within:border-indigo-500/80 rounded-2xl px-3.5 py-2.5 transition-all shadow-inner"
          >
            {/* Number badge */}
            <div className="w-6 h-6 rounded-full bg-[#1e2942] flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
              {index + 1}
            </div>

            {/* Input */}
            <input
              type="text"
              value={player}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder={`플레이어 ${index + 1}`}
              maxLength={15}
              className="flex-1 bg-transparent text-sm font-medium text-white placeholder-slate-500 focus:outline-none"
            />

            {/* Delete button if more than 1 player */}
            {players.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemovePlayer(index)}
                aria-label={`${player} 삭제`}
                className="text-slate-500 hover:text-rose-400 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Main Next Step Button */}
      <button
        type="button"
        onClick={handleProceed}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-glow-primary active:scale-[0.99] transition-all duration-200 mb-6"
      >
        <span>다음 단계 (룰렛 내용 입력)</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Info Notice Box */}
      <div className="bg-dark-800/80 border border-dark-border/80 rounded-2xl p-3.5 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          참여할 플레이어 인원을 설정하고 다음 단계에서 룰렛 내용을 자유롭게 구성하세요.
        </p>
      </div>
    </div>
  );
}
