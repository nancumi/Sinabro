'use client';

import React from 'react';
import { Sparkles, Settings, ShieldCheck, Megaphone, LogIn, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenAdConfig: () => void;
  onOpenAnalytics: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, onOpenAdConfig, onOpenAnalytics }) => {
  const { isAdmin, adminEmail, loginWithGoogle, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-13 flex items-center justify-between">
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-[15px] text-white tracking-tight leading-none">
                WS
              </span>
              <span className="text-[12px] font-semibold text-slate-300 leading-none">
                With Sinabro
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 leading-none">
                AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 leading-none mt-1">
              스마트하게 즐기는 시간 때우기
            </span>
          </div>
        </div>

        {/* 우측 관리자 상태 및 편집 메뉴 */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px]">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                관리자 ({adminEmail})
              </span>
              <button
                type="button"
                onClick={onOpenAnalytics}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700/60 transition-colors"
                title="실시간 방문자 접속 통계 및 분석"
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-300" />
                <span>접속 통계</span>
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
                title="카테고리 및 콘텐츠 Vercel URL 관리"
              >
                <Settings className="w-3.5 h-3.5 text-sky-300" />
                <span>콘텐츠/URL 관리</span>
              </button>
              <button
                type="button"
                onClick={onOpenAdConfig}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-700/60 transition-colors"
                title="구글 애즈 설정"
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-300" />
                <span>광고 설정</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
                title="관리자 로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* 일반 방문자에게는 눈에 띄지 않게 우측 끝에 조용한 관리자 로그인 아이콘 */
            <button
              type="button"
              onClick={loginWithGoogle}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800/50 transition-colors"
              title="관리자 Google 로그인"
              aria-label="관리자 로그인"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
