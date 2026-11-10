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
  const { isAdmin, loginWithGoogle, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm select-none">
      {/* 1줄: 타이틀 & 로그인/로그아웃 버튼 */}
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

        {/* 우측 로그인 / 로그아웃 버튼 */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors text-[12px] cursor-pointer"
              title="관리자 로그아웃"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800/50 transition-colors cursor-pointer"
              title="관리자 Google 로그인"
              aria-label="관리자 로그인"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2줄: 관리자 로그인 시 4개 버튼 (관리자, 접속 통계, 콘텐츠 관리, 광고 설정) */}
      {isAdmin && (
        <div className="w-full bg-slate-950/90 border-t border-slate-800/70 py-2 px-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-end gap-2 overflow-x-auto no-scrollbar">
            {/* 1) 관리자 버튼 (이메일 생략) */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[12px] font-semibold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>관리자</span>
            </span>

            {/* 2) 접속 통계 */}
            <button
              type="button"
              onClick={onOpenAnalytics}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700/60 transition-colors cursor-pointer"
              title="실시간 방문자 접속 통계 및 분석"
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-300" />
              <span>접속 통계</span>
            </button>

            {/* 3) 콘텐츠 관리 (문구 수정) */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors cursor-pointer"
              title="카테고리 및 콘텐츠 관리"
            >
              <Settings className="w-3.5 h-3.5 text-sky-300" />
              <span>콘텐츠 관리</span>
            </button>

            {/* 4) 광고 설정 */}
            <button
              type="button"
              onClick={onOpenAdConfig}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-700/60 transition-colors cursor-pointer"
              title="구글 애즈 설정"
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-300" />
              <span>광고 설정</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
