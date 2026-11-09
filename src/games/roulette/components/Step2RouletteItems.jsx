import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Play, Sparkles, Check, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';
import { PRESET_OPTIONS, COLOR_PALETTE } from '../utils/constants';

export default function Step2RouletteItems({
  items,
  setItems,
  playersCount,
  onBack,
  onStartGame,
}) {
  const [newItemText, setNewItemText] = useState('');
  const [activePreset, setActivePreset] = useState(null);
  const [alertModalMessage, setAlertModalMessage] = useState(null);

  const handleAddItem = (e) => {
    e?.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    if (items.length >= 24) {
      setAlertModalMessage('룰렛 항목은 최대 24개까지 등록할 수 있습니다.');
      return;
    }

    sound.playClick();
    const nextColor = COLOR_PALETTE[items.length % COLOR_PALETTE.length];
    setItems([...items, { text: trimmed, color: nextColor }]);
    setNewItemText('');
  };

  const handleUpdateItem = (index, newText) => {
    const updated = [...items];
    updated[index] = { ...updated[index], text: newText };
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    sound.playClick();
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleApplyPreset = (preset) => {
    sound.playClick();
    setActivePreset(preset.id);
    const mapped = preset.items.map((it, idx) => ({
      text: it.text,
      color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    }));
    setItems(mapped);
  };

  const handleResetForCustom = () => {
    sound.playClick();
    setActivePreset(null);
    setItems([]);
  };

  const handleProceed = () => {
    sound.playClick();
    // Validate empty texts
    const valid = items.filter((i) => i.text.trim().length > 0);
    if (valid.length < 2) {
      setAlertModalMessage('최소 2개 이상의 유효한 항목을 입력해주세요.');
      return;
    }
    setItems(valid);
    onStartGame();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4 text-[12px]">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800/80">
        <span className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase">
          ROULETTE ITEMS
        </span>
        <h2 className="text-[18px] font-black tracking-tight text-white mt-0.5">
          룰렛 내용 설정
        </h2>
        <p className="text-[11px] text-slate-400 mt-1">
          룰렛 판에 들어갈 항목들을 입력해주세요. (현재 총 <strong className="text-indigo-300">{items.length}개</strong>)
        </p>
      </div>

      {/* Preset & Custom Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>프리셋 선택 및 직접 입력</span>
          </div>
          <button
            type="button"
            onClick={handleResetForCustom}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/40 px-2 py-0.5 rounded-lg transition"
            title="모든 항목을 비우고 직접 입력합니다"
          >
            <RotateCcw className="w-3 h-3" />
            <span>직접 입력</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PRESET_OPTIONS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`py-2 px-2.5 rounded-xl text-[12px] font-medium text-left transition-all border flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-500/80 bg-indigo-500/20 text-white font-semibold shadow-xs'
                    : 'border-slate-700/60 bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span className="truncate">{preset.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add New Item Input */}
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="새 항목 입력"
          maxLength={20}
          className="flex-1 bg-slate-800/60 border border-slate-700/60 focus:border-indigo-500/80 rounded-xl px-3 py-2 text-[12px] text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-[12px] flex items-center justify-center gap-1 shrink-0 transition active:scale-95 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>추가</span>
        </button>
      </form>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="py-6 text-center text-[11px] text-slate-400 border border-dashed border-slate-700/80 rounded-xl">
          등록된 룰렛 항목이 없습니다.<br />
          상단 입력창에서 항목을 추가하거나 프리셋을 선택해주세요.
        </div>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {items.map((item, index) => {
            const itemColor = item.color || COLOR_PALETTE[index % COLOR_PALETTE.length];
            return (
              <div
                key={index}
                className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 focus-within:border-indigo-500/70 rounded-xl px-3 py-2 transition"
              >
                {/* Color dot */}
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-white/20"
                  style={{ backgroundColor: itemColor }}
                />

                {/* Number */}
                <span className="text-[11px] font-bold text-slate-500 w-4 text-center">
                  {index + 1}
                </span>

                {/* Text Input */}
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleUpdateItem(index, e.target.value)}
                  placeholder={`항목 ${index + 1} 입력`}
                  maxLength={20}
                  className="flex-1 bg-transparent text-[12px] font-medium text-white placeholder-slate-500 focus:outline-none"
                />

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition"
                  title="항목 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-5 gap-2">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="col-span-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[12px] flex items-center justify-center gap-1.5 border border-slate-700/60 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>이전 설정</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="col-span-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>게임 시작!</span>
        </button>
      </div>

      {/* Summary Tag */}
      <div className="text-center text-[11px] text-slate-400">
        참여 인원 : <span className="text-slate-200 font-semibold">{playersCount}명</span>
      </div>

      {/* Alert Modal */}
      {alertModalMessage && (
        <div
          onClick={() => setAlertModalMessage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-default"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl text-center cursor-default"
          >
            <div className="text-[12px] text-slate-200 font-medium leading-relaxed mb-4">
              {alertModalMessage}
            </div>
            <button
              type="button"
              onClick={() => setAlertModalMessage(null)}
              className="w-full py-2 px-4 rounded-xl text-[12px] font-semibold bg-[#a5b4fc] hover:bg-[#c7d2fe] text-slate-900 transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
