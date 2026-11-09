import React, { useState, useEffect } from 'react';
import { Maximize2, RotateCcw, Sparkles } from 'lucide-react';
import { SPEEDS, FONT_SIZES } from '../utils/constants';

export default function LedDisplay({
  text = '시나브로',
  textColor = '#ffe600',
  bgColor = '#000000',
  textEffect = 'marquee-left',
  bgEffect = 'solid',
  glowLevel = 'neon',
  fontSize = 'lg',
  speed = 'normal',
  isViewerOpen = false,
  onToggleViewer,
}) {
  const [showExitHint, setShowExitHint] = useState(true);

  // 속도 초(seconds) 계산
  const currentSpeed = SPEEDS.find((s) => s.id === speed) || SPEEDS[1];
  const speedSec = currentSpeed.durationSec;

  // 폰트 크기 계산 (전체 뷰 모드일 때는 화면에 맞춰 시원하게 확대)
  const currentFontSize = FONT_SIZES.find((f) => f.id === fontSize) || FONT_SIZES[2];
  const basePx = isViewerOpen ? Math.round(currentFontSize.px * 1.5) : currentFontSize.px;

  // 전체 화면 모드 진입 시 3초 후 힌트 숨김
  useEffect(() => {
    if (!isViewerOpen) {
      setShowExitHint(true);
      return;
    }
    const timer = setTimeout(() => {
      setShowExitHint(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [isViewerOpen]);

  // 외부 광선(Glow) 효과 계산
  const getTextGlowStyle = () => {
    switch (glowLevel) {
      case 'none':
        return { textShadow: 'none' };
      case 'soft':
        return { textShadow: `0 0 8px ${textColor}aa` };
      case 'neon':
        return {
          textShadow: `0 0 6px ${textColor}, 0 0 16px ${textColor}, 0 0 35px ${textColor}99`,
        };
      case 'intense':
        return {
          textShadow: `0 0 6px #ffffff, 0 0 18px ${textColor}, 0 0 38px ${textColor}, 0 0 70px ${textColor}, 0 0 110px ${textColor}`,
        };
      default:
        return { textShadow: `0 0 8px ${textColor}` };
    }
  };

  // 고정형 애니메이션 스타일 생성 (깜빡임, 바운스, 펄스)
  const getStaticTextAnimationStyle = () => {
    switch (textEffect) {
      case 'blink':
        return {
          animation: `ledBlink ${Math.max(0.4, speedSec * 0.12)}s step-start infinite`,
          whiteSpace: 'nowrap',
        };
      case 'bounce':
        return {
          animation: `ledBounce ${Math.max(0.6, speedSec * 0.18)}s ease-in-out infinite`,
          whiteSpace: 'nowrap',
        };
      case 'glow':
        return {
          animation: `ledGlowPulse ${Math.max(1.0, speedSec * 0.25)}s ease-in-out infinite`,
          whiteSpace: 'nowrap',
        };
      case 'static':
      default:
        return {
          whiteSpace: 'nowrap',
        };
    }
  };

  // 배경 연출 효과 스타일
  const getBackgroundStyle = () => {
    switch (bgEffect) {
      case 'strobe':
        return {
          backgroundColor: bgColor,
          animation: `ledBgStrobe ${Math.max(0.2, speedSec * 0.08)}s steps(2, start) infinite`,
        };
      case 'neon-cycle':
        return {
          backgroundColor: bgColor,
          animation: `ledNeonCycle ${speedSec * 0.8}s linear infinite`,
        };
      case 'aurora':
        return {
          background: `linear-gradient(135deg, ${bgColor}, #3b82f6, #ec4899, #8b5cf6, ${bgColor})`,
          backgroundSize: '300% 300%',
          animation: `ledAurora ${speedSec * 1.2}s ease infinite`,
        };
      case 'solid':
      default:
        return {
          backgroundColor: bgColor,
        };
    }
  };

  const displayText = text.trim() === '' ? '시나브로' : text;
  const isMarquee = textEffect === 'marquee-left' || textEffect === 'marquee-right';

  // 텍스트 송출 렌더러 (마키는 빈틈없는 무한 루프, 그 외는 중앙 배치)
  const renderContent = () => {
    if (isMarquee) {
      const isLeft = textEffect === 'marquee-left';
      return (
        <div className="relative w-full h-full flex items-center overflow-hidden">
          <div
            style={{
              animation: `${isLeft ? 'ledSeamlessLeft' : 'ledSeamlessRight'} ${speedSec}s linear infinite`,
            }}
            className="flex items-center shrink-0 w-max will-change-transform select-none"
          >
            {/* 전반부 (Half 1) */}
            <div className="flex items-center shrink-0">
              <span
                style={{
                  color: textColor,
                  fontSize: `${basePx}px`,
                  ...getTextGlowStyle(),
                }}
                className="px-8 sm:px-14 inline-block font-black tracking-widest whitespace-nowrap"
              >
                {displayText}
              </span>
              {displayText.length <= 8 && (
                <span
                  style={{
                    color: textColor,
                    fontSize: `${basePx}px`,
                    ...getTextGlowStyle(),
                  }}
                  className="px-8 sm:px-14 inline-block font-black tracking-widest whitespace-nowrap"
                >
                  {displayText}
                </span>
              )}
            </div>

            {/* 후반부 쌍둥이 트랙 (Half 2 - 한쪽에서 사라짐과 동시에 다른 쪽에서 나타남) */}
            <div className="flex items-center shrink-0">
              <span
                style={{
                  color: textColor,
                  fontSize: `${basePx}px`,
                  ...getTextGlowStyle(),
                }}
                className="px-8 sm:px-14 inline-block font-black tracking-widest whitespace-nowrap"
              >
                {displayText}
              </span>
              {displayText.length <= 8 && (
                <span
                  style={{
                    color: textColor,
                    fontSize: `${basePx}px`,
                    ...getTextGlowStyle(),
                  }}
                  className="px-8 sm:px-14 inline-block font-black tracking-widest whitespace-nowrap"
                >
                  {displayText}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 깜빡임, 통통 튀기, 네온 펄스, 고정 모드
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-4">
        <div
          style={{
            color: textColor,
            fontSize: `${basePx}px`,
            ...getTextGlowStyle(),
            ...getStaticTextAnimationStyle(),
          }}
          className="font-black tracking-wider will-change-transform text-center"
        >
          {displayText}
        </div>
      </div>
    );
  };

  // 1. 모바일 전용 9:16(16:9 회전) 100% 비율 최우선 전체 뷰 모드
  if (isViewerOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none">
        {/* 일반 화면 복귀 플로팅 버튼 */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleViewer}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700 shadow-2xl backdrop-blur-md text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>일반 화면 복귀</span>
          </button>
        </div>

        {/* 16:9 비율 최우선 유지 + 화면 최대 100% 채움 + 90도 회전된 가로 전광판 */}
        <div
          style={{
            width: 'min(100vh, calc(100vw * 16 / 9))',
            height: 'min(100vw, calc(100vh * 9 / 16))',
            aspectRatio: '16 / 9',
            transform: 'rotate(90deg)',
            transformOrigin: 'center center',
            ...getBackgroundStyle(),
          }}
          className="relative flex items-center justify-center overflow-hidden transition-colors shadow-2xl"
        >
          {renderContent()}
        </div>

        {/* 회전 모드 진입 시 가로 방향 안내 힌트 */}
        {showExitHint && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/85 border border-white/20 text-xs text-slate-300 backdrop-blur-md pointer-events-none animate-pulse flex items-center gap-2 shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>16:9 가로 비율 최우선 모드입니다. 스마트폰을 가로로 돌려 응원하세요!</span>
          </div>
        )}
      </div>
    );
  }

  // 2. 메인 페이지 내 16:9 가로형 실시간 미리보기 카드
  return (
    <div
      className="relative select-none overflow-hidden transition-all duration-300 w-full aspect-[16/9] max-h-[360px] rounded-2xl border border-slate-800 shadow-2xl shadow-cyan-950/20"
      style={getBackgroundStyle()}
    >
      {/* 베젤/프레임 내부 섀도우 */}
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl shadow-[inset_0_0_35px_rgba(0,0,0,0.85)]" />

      {/* 텍스트 송출 영역 */}
      {renderContent()}

      {/* 우측 상단 모바일 전체 화면 진입 버튼 */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={onToggleViewer}
          aria-label="모바일 전체화면 시작"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-slate-200 hover:text-white backdrop-blur-md border border-white/15 text-xs font-semibold shadow-lg transition-all cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>전체화면 (응원 모드)</span>
        </button>
      </div>
    </div>
  );
}
