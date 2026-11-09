import React from 'react';
import {
  Palette,
  Sparkles,
  Type,
  Gauge,
  SlidersHorizontal,
  Maximize2,
  X,
  SunMedium,
  Layers,
} from 'lucide-react';
import {
  PALETTE_COLORS,
  TEXT_EFFECTS,
  GLOW_LEVELS,
  BG_EFFECTS,
  FONT_SIZES,
  SPEEDS,
} from '../utils/constants';

const PRESET_WORDS = ['시나브로', '대박나자🔥', '사랑해❤️', '응원합니다!', '오늘도 수고했어✨'];

export default function ControlPanel({
  activeTab = 'color',
  setActiveTab,
  text,
  setText,
  textColor,
  setTextColor,
  bgColor,
  setBgColor,
  textEffect,
  setTextEffect,
  glowLevel,
  setGlowLevel,
  bgEffect,
  setBgEffect,
  fontSize,
  setFontSize,
  speed,
  setSpeed,
  onStartCheer,
}) {
  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* 3단계 탭 전환 헤더 */}
      <div className="flex p-1 bg-slate-950/70 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('color')}
          className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'color'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>1. 컬러 & 문구</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('text-effect')}
          className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'text-effect'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. 글자 효과</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bg-effect')}
          className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'bg-effect'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3. 배경 효과</span>
        </button>
      </div>

      {/* 1단계: 컬러 및 문구 설정 */}
      {activeTab === 'color' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 텍스트 입력창 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-cyan-400" />
                전광판 문구 입력
              </label>
              <span className="text-[11px] text-slate-500">{text.length}자</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={30}
                placeholder="표시할 문구를 입력하세요 (기본: 시나브로)"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 pr-10"
              />
              {text.length > 0 && (
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 빠른 문구 추천 칩 */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_WORDS.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => setText(word)}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* 1. 배경색 선택 (10종 팔레트) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                배경색 선택 (기본: 블랙)
              </label>
              <span className="text-[11px] text-slate-400">
                {PALETTE_COLORS.find((c) => c.hex.toLowerCase() === bgColor.toLowerCase())?.name || bgColor}
              </span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {PALETTE_COLORS.map((c) => {
                const isSelected = bgColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={`bg-${c.id}`}
                    type="button"
                    onClick={() => setBgColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-11 rounded-xl transition-all relative flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-cyan-400 ring-offset-slate-900 scale-105 shadow-lg'
                        : 'border border-slate-700/60 hover:scale-105 opacity-85 hover:opacity-100'
                    }`}
                    title={c.name}
                  >
                    {isSelected && (
                      <span
                        className={`text-xs font-bold ${
                          c.isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 글자색 선택 (10종 팔레트) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                글자색 (LED 발광색) 선택 (10가지)
              </label>
              <span className="text-[11px] text-cyan-400 font-semibold">
                {PALETTE_COLORS.find((c) => c.hex.toLowerCase() === textColor.toLowerCase())?.name || textColor}
              </span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {PALETTE_COLORS.map((c) => {
                const isSelected = textColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={`text-${c.id}`}
                    type="button"
                    onClick={() => setTextColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-11 rounded-xl transition-all relative flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-pink-400 ring-offset-slate-900 scale-105 shadow-lg shadow-pink-500/25'
                        : 'border border-slate-700/60 hover:scale-105 opacity-85 hover:opacity-100'
                    }`}
                    title={c.name}
                  >
                    {isSelected && (
                      <span
                        className={`text-xs font-bold ${
                          c.isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 폰트 크기 및 속도 설정 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">글자 크기</label>
              <div className="grid grid-cols-4 gap-1.5">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setFontSize(size.id)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      fontSize === size.id
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                모션 속도
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {SPEEDS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSpeed(s.id)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      speed === s.id
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2단계: 글자 효과 및 외부 광선(Glow) 조절 */}
      {activeTab === 'text-effect' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 글자 모션 효과 선택 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              글자 모션 효과 (애니메이션)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TEXT_EFFECTS.map((eff) => {
                const isSelected = textEffect === eff.id;
                return (
                  <button
                    key={eff.id}
                    type="button"
                    onClick={() => setTextEffect(eff.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-pink-500/15 border-pink-500/70 text-white shadow-lg shadow-pink-500/15'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200 mb-0.5 flex items-center justify-between">
                      <span>{eff.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      {eff.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 외부 광선(Glow) 강도 조절 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              외부 광선 (네온 발광 후광 강도)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {GLOW_LEVELS.map((g) => {
                const isSelected = glowLevel === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGlowLevel(g.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/70 text-white shadow-lg shadow-amber-500/15'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200 mb-0.5 flex items-center justify-between">
                      <span>{g.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      {g.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3단계: 배경 효과 (깔끔한 단색이 기본값으로 맨 왼쪽 배치) */}
      {activeTab === 'bg-effect' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                배경 연출 효과 선택
              </label>
              <span className="text-[11px] text-indigo-400 font-semibold">
                기본값: 깔끔한 단색
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BG_EFFECTS.map((bg) => {
                const isSelected = bgEffect === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBgEffect(bg.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500/70 text-white shadow-lg shadow-indigo-500/15'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
                      <span>{bg.label}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      {bg.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 가로 9:16 전광판 전체화면 CTA 버튼 */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onStartCheer}
          className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 shadow-xl shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
          <span>모바일 가로 9:16 전광판 켜기 (응원 모드)</span>
        </button>
        <p className="text-center text-[11px] text-slate-500 mt-2">
          전체화면 전환 시 글자가 90도 회전되어 스마트폰을 쥐고 응원하기에 최적화됩니다.
        </p>
      </div>
    </div>
  );
}
