import React, { useRef, useState, useEffect } from 'react';
import { Maximize2, Minimize2, Play, Sparkles } from 'lucide-react';
import { SPEEDS, FONT_SIZES } from '../utils/constants';

export default function LedDisplay({
  text = '시나브로',
  textColor = '#ffe600',
  bgColor = '#000000',
  textEffect = 'marquee-left',
  bgEffect = 'dots',
  fontSize = 'lg',
  speed = 'normal',
  isFullscreen = false,
  onToggleFullscreen,
}) {
  const containerRef = useRef(null);
  const [showControlsInFullscreen, setShowControlsInFullscreen] = useState(true);

  // 속도 초(seconds) 계산
  const currentSpeed = SPEEDS.find((s) => s.id === speed) || SPEEDS[1];
  const speedSec = currentSpeed.durationSec;

  // 폰트 크기 계산 (전체화면일 때는 화면 비율에 맞춰 더 크게)
  const currentFontSize = FONT_SIZES.find((f) => f.id === fontSize) || FONT_SIZES[2];
  const basePx = isFullscreen ? Math.round(currentFontSize.px * 1.6) : currentFontSize.px;

  // 전체화면 시 3초 후 컨트롤 자동 숨김
  useEffect(() => {
    if (!isFullscreen) {
      setShowControlsInFullscreen(true);
      return;
    }
    const timer = setTimeout(() => {
      setShowControlsInFullscreen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isFullscreen, showControlsInFullscreen]);

  // 글자 애니메이션 스타일 생성
  const getTextAnimationStyle = () => {
    switch (textEffect) {
      case 'marquee-right':
        return {
          animation: `ledMarqueeRight ${speedSec}s linear infinite`,
          display: 'inline-block',
          whiteSpace: 'nowrap',
        };
      case 'marquee-left':
        return {
          animation: `ledMarqueeLeft ${speedSec}s linear infinite`,
          display: 'inline-block',
          whiteSpace: 'nowrap',
        };
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

  // 배경 스타일 생성
  const getBackgroundStyle = () => {
    if (bgEffect === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${bgColor}, #1e1b4b, ${bgColor}, #0f172a)`,
        backgroundSize: '300% 300%',
        animation: `ledGradientShift ${speedSec * 1.5}s ease infinite`,
      };
    }
    return {
      backgroundColor: bgColor,
    };
  };

  // 네온 텍스트 그림자
  const textShadowStyle = {
    color: textColor,
    fontSize: `${basePx}px`,
    textShadow: `
      0 0 6px ${textColor},
      0 0 15px ${textColor},
      0 0 35px ${textColor}aa,
      0 0 60px ${textColor}66
    `,
  };

  const displayText = text.trim() === '' ? '시나브로' : text;

  return (
    <div
      ref={containerRef}
      onClick={() => {
        if (isFullscreen) {
          setShowControlsInFullscreen((prev) => !prev);
        }
      }}
      className={`relative select-none overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-black cursor-pointer'
          : 'w-full aspect-[16/9] max-h-[380px] rounded-2xl border border-slate-700/60 shadow-2xl shadow-cyan-950/20'
      }`}
      style={getBackgroundStyle()}
    >
      {/* 1. 배경 이펙트 레이어 (도트 매트릭스) */}
      {bgEffect === 'dots' && (
        <div className="absolute inset-0 led-dot-pattern pointer-events-none opacity-80" />
      )}

      {/* 2. 배경 이펙트 레이어 (레트로 스캔라인) */}
      {bgEffect === 'scanline' && (
        <div className="absolute inset-0 led-scanline-pattern pointer-events-none opacity-70" />
      )}

      {/* 3. 베젤/프레임 내부 하이라이트 (미리보기 모드일 때 전광판 느낌 강조) */}
      {!isFullscreen && (
        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]" />
      )}

      {/* 4. 텍스트 송출 영역 */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-4">
        <div
          style={{
            ...textShadowStyle,
            ...getTextAnimationStyle(),
          }}
          className="font-black tracking-wider will-change-transform"
        >
          {displayText}
        </div>
      </div>

      {/* 5. 우측 상단 전체화면 토글 버튼 */}
      {(!isFullscreen || showControlsInFullscreen) && (
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFullscreen();
            }}
            aria-label={isFullscreen ? '전체화면 종료' : '전체화면 시작'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white backdrop-blur-md border border-white/15 text-xs font-semibold shadow-lg transition-all"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-rose-400" />
                <span>화면 나가기</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>전체화면</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 6. 전체화면 시 화면 터치 안내 힌트 (잠깐 표시) */}
      {isFullscreen && showControlsInFullscreen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 border border-white/15 text-[11px] text-slate-400 backdrop-blur-sm pointer-events-none animate-pulse">
          화면을 터치하면 컨트롤이 나타나거나 숨겨집니다
        </div>
      )}
    </div>
  );
}
