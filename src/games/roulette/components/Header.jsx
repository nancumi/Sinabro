import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Header({ currentStep, onReset }) {
  const [muted, setMuted] = useState(sound.isMuted());

  const handleToggleSound = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sound.playClick();
    }
  };

  const steps = [
    { number: 1, label: '인원 설정' },
    { number: 2, label: '항목 편집' },
    { number: 3, label: '룰렛 배틀' },
  ];

  return (
    <header className="w-full max-w-md mx-auto mb-5 px-3 pt-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-[2px] shadow-glow-primary">
            <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase block">
              Sinabro Mini Game
            </span>
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-tight">
              시나브로 룰렛 배틀
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            aria-label="소리 켜기/끄기"
            className="p-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-300 hover:text-white border border-dark-border transition"
            title={muted ? '소리 켜기' : '음소거'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {currentStep > 1 && (
            <button
              onClick={onReset}
              aria-label="처음부터 다시하기"
              className="p-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-300 hover:text-rose-400 border border-dark-border transition"
              title="처음으로"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-3 gap-2 bg-dark-800/80 backdrop-blur p-1.5 rounded-2xl border border-dark-border">
        {steps.map((s) => {
          const isActive = currentStep === s.number;
          const isPassed = currentStep > s.number;
          return (
            <div
              key={s.number}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                  : isPassed
                  ? 'bg-dark-700/60 text-indigo-300'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isActive ? 'bg-white text-indigo-700 font-bold' : isPassed ? 'bg-indigo-900/80 text-indigo-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isPassed ? '✓' : s.number}
              </span>
              <span className="truncate">{s.label}</span>
            </div>
          );
        })}
      </div>
    </header>
  );
}

