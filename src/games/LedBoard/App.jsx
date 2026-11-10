'use client';

import React, { useState } from 'react';
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
      {/* 1. 메인 콘텐츠 컨테이너 */}
      <main className="w-full max-w-3xl space-y-6">
        {/* 가로형 전광판 실시간 미리보기 */}
        <div className="w-full">
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
