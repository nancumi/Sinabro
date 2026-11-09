'use client';

import React, { useState } from 'react';
import { Sparkles, Tv } from 'lucide-react';
import LedDisplay from './components/LedDisplay';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('color');
  const [text, setText] = useState('시나브로');
  const [textColor, setTextColor] = useState('#ffe600');
  const [bgColor, setBgColor] = useState('#000000');
  const [textEffect, setTextEffect] = useState('marquee-left');
  const [bgEffect, setBgEffect] = useState('solid'); // 기본값: 깔끔한 단색
  const [glowLevel, setGlowLevel] = useState('neon'); // 기본값: 네온 광선
  const [fontSize, setFontSize] = useState('lg');
  const [speed, setSpeed] = useState('normal');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const toggleViewer = () => {
    setIsViewerOpen((prev) => !prev);
  };

  return (
    <div className="w-full text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 pb-12 select-none">
      {/* 1. 상단 타이틀 헤더 */}
      <header className="w-full max-w-3xl mb-4 sm:mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>모바일 가로형 LED 디스플레이</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-pink-400 bg-clip-text text-transparent">
          LED 전광판 만들기
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          직관적인 색상 선택과 모션 효과로 나만의 개성 넘치는 응원 전광판을 완성해 보세요.
        </p>
      </header>

      {/* 2. 메인 콘텐츠 컨테이너 */}
      <main className="w-full max-w-3xl space-y-6">
        {/* 가로형 전광판 실시간 미리보기 (16:9 와이드 비율) */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              실시간 가로형 전광판 미리보기
            </span>
            <span className="text-[11px] text-slate-500">16:9 와이드 모바일 뷰</span>
          </div>

          <LedDisplay
            text={text}
            textColor={textColor}
            bgColor={bgColor}
            textEffect={textEffect}
            bgEffect={bgEffect}
            glowLevel={glowLevel}
            fontSize={fontSize}
            speed={speed}
            isViewerOpen={isViewerOpen}
            onToggleViewer={toggleViewer}
          />
        </div>

        {/* 설정 컨트롤 패널 (3단계 탭) */}
        {!isViewerOpen && (
          <ControlPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            text={text}
            setText={setText}
            textColor={textColor}
            setTextColor={setTextColor}
            bgColor={bgColor}
            setBgColor={setBgColor}
            textEffect={textEffect}
            setTextEffect={setTextEffect}
            glowLevel={glowLevel}
            setGlowLevel={setGlowLevel}
            bgEffect={bgEffect}
            setBgEffect={setBgEffect}
            fontSize={fontSize}
            setFontSize={setFontSize}
            speed={speed}
            setSpeed={setSpeed}
            onStartCheer={toggleViewer}
          />
        )}
      </main>
    </div>
  );
}
