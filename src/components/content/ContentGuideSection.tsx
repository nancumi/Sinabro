'use client';

import React from 'react';
import { ContentItem } from '@/types';
import { getGameKey } from '@/games';
import { GAME_GUIDES, DEFAULT_GUIDE, GameGuide } from '@/data/gameGuides';
import { BookOpen, Gamepad2, Lightbulb, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface ContentGuideSectionProps {
  content: ContentItem | null;
}

export const ContentGuideSection: React.FC<ContentGuideSectionProps> = ({ content }) => {
  if (!content) return null;

  const gameKey = getGameKey(content.title, content.vercelUrl);
  const guide: GameGuide = (gameKey && GAME_GUIDES[gameKey]) ? GAME_GUIDES[gameKey] : {
    ...DEFAULT_GUIDE,
    title: content.title || DEFAULT_GUIDE.title,
    summary: content.description || DEFAULT_GUIDE.summary,
  };

  return (
    <article className="w-full mt-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl space-y-6 text-slate-300">
      {/* 헤더 안내 */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 border border-sky-500/30 text-sky-300">
            {guide.category} 가이드
          </span>
          <span className="text-xs text-slate-500">• 무설치 웹 표준 지원</span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
          <span>{guide.title} 상세 가이드 및 이용 안내</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          {guide.summary}
        </p>
      </div>

      {/* 1. 개요 및 기획 의도 */}
      <section className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>콘텐츠 개요 및 특징</span>
        </h3>
        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          {guide.overview.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </section>

      {/* 2. 조작법 및 플레이 방법 */}
      <section className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>조작법 및 플레이 순서</span>
        </h3>
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <ol className="space-y-2 text-xs sm:text-sm">
            {guide.howToPlay.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold text-[11px] shrink-0 mt-0.5 border border-emerald-500/30">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. 규칙 및 팁 (2열 그리드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 규칙 */}
        <section className="space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>승패 규칙 & 판정 기준</span>
          </h3>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 h-[calc(100%-2rem)]">
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {guide.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 실전 꿀팁 */}
        <section className="space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>실전 활용 및 승리 팁</span>
          </h3>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 h-[calc(100%-2rem)]">
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {guide.proTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* 4. 자주 묻는 질문 (FAQ) */}
      <section className="space-y-2">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-rose-400" />
          <span>자주 묻는 질문 (FAQ)</span>
        </h3>
        <div className="space-y-2.5">
          {guide.faq.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80 space-y-1"
            >
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span className="text-rose-400 font-black">Q.</span>
                <span>{item.q}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 pl-5 leading-relaxed">
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};
