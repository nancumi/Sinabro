'use client';

import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types';
import { Settings, Sparkles, Plus } from 'lucide-react';
import { GAME_REGISTRY, getGameKey } from '@/games';

interface ContentViewerProps {
  content: ContentItem | null;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({
  content,
  isAdmin,
  onOpenAdmin,
}) => {
  const [dynamicHeight, setDynamicHeight] = useState<number | null>(null);

  useEffect(() => {
    // 혹시 외부 iframe을 로드할 경우를 위한 auto-resize 리스너
    const handleMessage = (event: MessageEvent) => {
      if (
        (event.data?.type === 'SINABRO_RESIZE' || event.data?.type === 'SET_HEIGHT') &&
        typeof event.data.height === 'number'
      ) {
        setDynamicHeight(Math.max(500, event.data.height + 40));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!content) {
    return (
      <div className="w-full min-h-[420px] bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-sky-400 flex items-center justify-center mb-3 border border-slate-700">
          <Sparkles className="w-6 h-6" />
        </div>
        <h4 className="text-[13px] font-semibold text-slate-200 mb-4">
          즐길 콘텐츠를 선택해 주세요
        </h4>
        {isAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            새 콘텐츠 등록하기
          </button>
        )}
      </div>
    );
  }

  // 1. 네이티브 React 게임 컴포넌트 매칭 (iframe 없는 직접 렌더링)
  const gameKey = getGameKey(content.title, content.vercelUrl);
  const NativeGameComponent = gameKey ? GAME_REGISTRY[gameKey] : null;
  const hasUrl = Boolean(content.vercelUrl && content.vercelUrl.trim().length > 0);

  return (
    <div
      style={!NativeGameComponent && dynamicHeight ? { height: `${dynamicHeight}px` } : undefined}
      className={`relative bg-slate-950 rounded-xl border border-slate-800 shadow-sm flex flex-col transition-all overflow-hidden w-full ${
        NativeGameComponent ? '' : dynamicHeight ? '' : 'min-h-[600px]'
      }`}
    >
      {/* 콘텐츠 상단 바 */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-slate-800 text-slate-200 select-none">
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="font-semibold text-[12px] text-slate-100 shrink-0 max-w-[120px] sm:max-w-[180px] md:max-w-[220px] truncate">
            {content.title}
          </span>
          {content.description && (
            <span className="text-[11px] text-slate-400 truncate flex-1 min-w-0" title={content.description}>
              - {content.description}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors"
              title="콘텐츠 정보 편집"
            >
              <Settings className="w-3 h-3" />
              편집
            </button>
          )}
        </div>
      </div>

      {/* 실행 영역 (네이티브 컴포넌트 직접 실행 또는 외부 URL fallback) */}
      <div className="relative flex-1 w-full bg-slate-950 flex flex-col items-center justify-center">
        {NativeGameComponent ? (
          // ★ 아이프레임 없이 게임 크기에 딱 맞춰 자연스럽게 렌더링 ★
          <div className="w-full flex justify-center py-2 sm:py-3">
            <NativeGameComponent />
          </div>
        ) : hasUrl ? (
          // 외부 Vercel URL이 따로 있는 경우 fallback iframe
          <iframe
            src={content.vercelUrl}
            title={content.title}
            className="w-full h-full min-h-[600px] border-0 bg-slate-950"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="p-3 bg-slate-900 rounded-full mb-3 border border-slate-800">
              <Settings className="w-6 h-6 text-amber-400" />
            </div>
            <h4 className="text-[12px] font-semibold text-slate-200 mb-1">
              연결된 게임 콘텐츠가 없습니다
            </h4>
            <p className="text-[11px] text-slate-400 max-w-sm mb-4 leading-relaxed">
              관리자 설정에서 콘텐츠 이름을 등록하시면 해당 게임이 즉시 화면에 실행됩니다.
            </p>
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
              >
                콘텐츠 등록하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
