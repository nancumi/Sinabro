'use client';

import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types';
import { Settings, Sparkles, Plus } from 'lucide-react';

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
    // 자식 콘텐츠(iframe)로부터 높이 동기화 메시지 수신 (게임/콘텐츠 높이에 맞춰 자동 확장)
    const handleMessage = (event: MessageEvent) => {
      if (
        (event.data?.type === 'SINABRO_RESIZE' || event.data?.type === 'SET_HEIGHT') &&
        typeof event.data.height === 'number'
      ) {
        setDynamicHeight(Math.max(650, event.data.height + 40));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!content) {
    return (
      <div className="w-full h-[520px] md:h-[650px] bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col items-center justify-center p-6 text-center text-slate-400">
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
            새 Vercel 콘텐츠 등록하기
          </button>
        )}
      </div>
    );
  }

  const hasUrl = Boolean(content.vercelUrl && content.vercelUrl.trim().length > 0);

  return (
    <div
      style={dynamicHeight ? { height: `${dynamicHeight}px` } : undefined}
      className={`relative bg-slate-950 rounded-xl border border-slate-800 shadow-sm flex flex-col transition-all overflow-hidden ${
        dynamicHeight ? '' : 'w-full h-[620px] md:h-[780px]'
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
              title="Vercel URL 편집"
            >
              <Settings className="w-3 h-3" />
              URL 편집
            </button>
          )}
        </div>
      </div>

      {/* 실행 영역 */}
      <div className="relative flex-1 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {hasUrl ? (
          <iframe
            src={content.vercelUrl}
            title={content.title}
            className="w-full h-full border-0 bg-slate-950"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="p-3 bg-slate-900 rounded-full mb-3 border border-slate-800">
              <Settings className="w-6 h-6 text-amber-400" />
            </div>
            <h4 className="text-[12px] font-semibold text-slate-200 mb-1">
              연결된 Vercel 콘텐츠 주소가 없습니다
            </h4>
            <p className="text-[11px] text-slate-400 max-w-sm mb-4 leading-relaxed">
              제작하신 게임이나 시간 때우기 콘텐츠를 Vercel에 배포한 후, 주소를 등록하시면 이곳에 바로 실행됩니다.
            </p>
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
              >
                Vercel 주소 등록하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
