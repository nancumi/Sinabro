import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, RotateCcw } from 'lucide-react';
import { SPEEDS, FONT_SIZES, BOARD_WIDTH, BOARD_HEIGHT } from '../utils/constants';

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
  const [showControls, setShowControls] = useState(false);
  const [fullScale, setFullScale] = useState(1);
  const [previewWidth, setPreviewWidth] = useState(854);
  const previewRef = useRef(null);
  const hideTimerRef = useRef(null);

  // 전체 화면 모드 진입 시 버튼 잠깐 보여주고 2.5초 후 자동 숨김
  useEffect(() => {
    if (isViewerOpen) {
      setShowControls(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    } else {
      setShowControls(false);
    }

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isViewerOpen]);

  // 화면 터치 시 버튼 토글 및 3.5초 자동 숨김 타이머
  const handleScreenTap = () => {
    setShowControls((prev) => {
      const next = !prev;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (next) {
        hideTimerRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3500);
      }
      return next;
    });
  };

  // 전체화면 모드 스케일 계산 (854 x 480 규격을 기기 화면에 100% 최적 밀착 맞춤)
  useEffect(() => {
    if (!isViewerOpen) return;

    const calculateScale = () => {
      // 90도 회전 시 854px은 세로(innerHeight)에, 480px은 가로(innerWidth)에 매칭
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const scale = Math.min(vh / BOARD_WIDTH, vw / BOARD_HEIGHT);
      setFullScale(scale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isViewerOpen]);

  // 미리보기 카드 너비 측정 (미리보기 내 폰트 비율 일치)
  useEffect(() => {
    if (isViewerOpen || !previewRef.current) return;

    const updatePreviewWidth = () => {
      if (previewRef.current) {
        setPreviewWidth(previewRef.current.clientWidth);
      }
    };

    updatePreviewWidth();
    const observer = new ResizeObserver(updatePreviewWidth);
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [isViewerOpen]);

  // 속도 초(seconds) 계산
  const currentSpeed = SPEEDS.find((s) => s.id === speed) || SPEEDS[1];
  const speedSec = currentSpeed.durationSec;

  // 폰트 크기 계산: 854x480 정규 규격 기준
  const currentFontSize = FONT_SIZES.find((f) => f.id === fontSize) || FONT_SIZES[2];
  const previewScale = previewWidth > 0 ? previewWidth / BOARD_WIDTH : 0.5;
  const basePx = isViewerOpen ? currentFontSize.px : Math.max(20, Math.round(currentFontSize.px * previewScale));

  // 외부 광선(Glow) 효과 계산
  const getTextGlowStyle = () => {
    switch (glowLevel) {
      case 'none':
        return { textShadow: 'none' };
      case 'soft':
        return { textShadow: `0 0 10px ${textColor}aa` };
      case 'neon':
        return {
          textShadow: `0 0 8px ${textColor}, 0 0 20px ${textColor}, 0 0 45px ${textColor}99`,
        };
      case 'intense':
        return {
          textShadow: `0 0 8px #ffffff, 0 0 24px ${textColor}, 0 0 48px ${textColor}, 0 0 85px ${textColor}, 0 0 130px ${textColor}`,
        };
      default:
        return { textShadow: `0 0 10px ${textColor}` };
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

  // 텍스트 송출 렌더러 (한쪽에서 사라짐과 동시에 다른 쪽에서 나타나는 끊김 없는 무한 롤링)
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
                className="px-10 sm:px-16 inline-block font-black tracking-widest whitespace-nowrap"
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
                  className="px-10 sm:px-16 inline-block font-black tracking-widest whitespace-nowrap"
                >
                  {displayText}
                </span>
              )}
            </div>

            {/* 후반부 쌍둥이 트랙 (Half 2 - 한쪽에서 사라짐과 동시에 다른 쪽에서 완벽 밀착 등장) */}
            <div className="flex items-center shrink-0">
              <span
                style={{
                  color: textColor,
                  fontSize: `${basePx}px`,
                  ...getTextGlowStyle(),
                }}
                className="px-10 sm:px-16 inline-block font-black tracking-widest whitespace-nowrap"
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
                  className="px-10 sm:px-16 inline-block font-black tracking-widest whitespace-nowrap"
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

  // 1. 모바일 전용 854 x 480 px 규격 고정 + 90도 회전 전체 화면 모드
  if (isViewerOpen) {
    return (
      <div
        onClick={handleScreenTap}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none cursor-pointer"
      >
        {/* 일반 화면 복귀 플로팅 버튼 (화면 터치 시에만 표시) */}
        <div
          className={`fixed top-4 right-4 z-50 transition-opacity duration-300 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleViewer();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700 shadow-2xl backdrop-blur-md text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>일반 화면 복귀</span>
          </button>
        </div>

        {/* 854 x 480 px 고정 캔버스 + 화면 크기에 맞춰 scale + 90도 회전 */}
        <div
          style={{
            width: `${BOARD_WIDTH}px`,
            height: `${BOARD_HEIGHT}px`,
            transform: `rotate(90deg) scale(${fullScale})`,
            transformOrigin: 'center center',
            ...getBackgroundStyle(),
          }}
          className="relative flex items-center justify-center overflow-hidden shrink-0 shadow-2xl transition-colors pointer-events-none"
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  // 2. 메인 페이지 내 854 x 480 비율 실시간 미리보기 카드
  return (
    <div
      ref={previewRef}
      className="relative select-none overflow-hidden transition-all duration-300 w-full aspect-[854/480] max-h-[380px] rounded-2xl border border-slate-800 shadow-2xl shadow-cyan-950/20"
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
