'use client';

import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types';
import { Settings, Sparkles, Plus, Play, Gamepad2, RefreshCw } from 'lucide-react';
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
    // 외부 iframe을 로드할 경우를 위한 auto-resize 리스너
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

  // 0. 초기 접속 시 웰컴 대문 화면 (아직 콘텐츠를 선택하지 않은 상태)
  if (!content) {
    return (
      <div className="w-full min-h-[460px] bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center p-8 text-center text-slate-400 select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600/20 to-blue-500/20 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/30 shadow-lg shadow-sky-500/10">
          <Sparkles className="w-8 h-8 animate-pulse text-sky-400" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-100 mb-2">
          즐길 콘텐츠를 선택해 주세요
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          상단 카테고리 메뉴를 누르거나 오른쪽 목록에서 원하는 게임 및 유용한 도구를 선택해 보세요!
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-semibold">
            <Gamepad2 className="w-4 h-4 text-sky-400" />
            <span>원하는 게임을 클릭하면 즉시 실행됩니다</span>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-950/90 hover:bg-sky-900 text-sky-200 border border-sky-700/70 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-sky-300" />
              <span>새 콘텐츠 등록</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 1. 네이티브 React 게임 컴포넌트 매칭 (iframe 없는 직접 렌더링)
  const gameKey = getGameKey(content.title, content.vercelUrl);
  const NativeGameComponent = gameKey ? GAME_REGISTRY[gameKey] : null;

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col">
      {/* 콘텐츠 상단 바 */}
      <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-4 h-4 shrink-0" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-100 truncate">{content.title}</h3>
            {content.description && (
              <p className="text-[11px] text-slate-400 truncate">{content.description}</p>
            )}
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shrink-0 cursor-pointer"
            title="콘텐츠 수정/관리"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">편집</span>
          </button>
        )}
      </div>

      {/* 콘텐츠 본문 뷰어 (네이티브 컴포넌트 또는 Vercel URL iframe) */}
      <div className="w-full flex-1 flex flex-col items-center justify-center bg-slate-950/40 p-2 sm:p-4">
        {NativeGameComponent ? (
          <div className="w-full">
            <NativeGameComponent />
          </div>
        ) : content.vercelUrl ? (
          <iframe
            src={content.vercelUrl}
            title={content.title}
            style={{
              height: dynamicHeight ? `${dynamicHeight}px` : '720px',
            }}
            className="w-full border-0 rounded-xl bg-slate-950 shadow-inner transition-all duration-300"
            allow="fullscreen; accelerometer; gyroscope"
          />
        ) : (
          <div className="p-10 sm:p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-200">
                새롭게 추가된 프로그램입니다!
              </p>
              <p className="text-xs text-slate-400">
                현재 브라우저 창이 업데이트 전 버전입니다. 아래 버튼을 눌러 최신 화면을 불러와 주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  url.searchParams.set('game', content.title);
                  window.location.href = url.toString();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>최신 버전 불러오기 (바로 실행)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
