'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Next.js dynamic import (Code Splitting):
// 사용자가 해당 게임을 클릭하기 전까지는 게임 코드를 1바이트도 불러오지 않아 초기 로딩 속도 최적화!
export const GAME_REGISTRY: Record<string, React.ComponentType> = {
  'timer': dynamic(() => import('./timer/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'roulette': dynamic(() => import('./roulette/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'finger-touch': dynamic(() => import('./finger-touch/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'ladder': dynamic(() => import('./ladder/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'mole-whack': dynamic(() => import('./mole-whack/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'number-merge': dynamic(() => import('./number-merge/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'reflex': dynamic(() => import('./reflex/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'slide-puzzle': dynamic(() => import('./slide-puzzle/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'one-stroke': dynamic(() => import('./GameOneStroke/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'animal-memory': dynamic(() => import('./AnimalMemory/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        게임을 로딩하는 중입니다...
      </div>
    ),
  }),
  'led-board': dynamic(() => import('./LedBoard/App'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 text-slate-400 text-[12px]">
        콘텐츠를 로딩하는 중입니다...
      </div>
    ),
  }),
};

// 콘텐츠 제목 또는 URL로 등록된 게임 키를 자동으로 매칭
export function getGameKey(title: string = '', url: string = ''): string | null {
  const t = title.toLowerCase();
  const u = url.toLowerCase();

  if (t.includes('전광판') || t.includes('led') || u.includes('led') || u.includes('board')) return 'led-board';
  if (t.includes('동물') || t.includes('기억력') || t.includes('animal') || u.includes('animal') || u.includes('memory')) return 'animal-memory';
  if (t.includes('한 붓') || t.includes('한붓') || t.includes('stroke') || u.includes('onestroke') || u.includes('stroke')) return 'one-stroke';
  if (t.includes('시간') || t.includes('타이머') || u.includes('timer')) return 'timer';
  if (t.includes('손가락') || t.includes('터치') || u.includes('finger-touch') || u.includes('touch')) return 'finger-touch';
  if (t.includes('룰렛') || u.includes('roulette')) return 'roulette';
  if (t.includes('사다리') || u.includes('ladder')) return 'ladder';
  if (t.includes('두더지') || u.includes('mole')) return 'mole-whack';
  if (t.includes('2048') || t.includes('숫자') || u.includes('number-merge')) return 'number-merge';
  if (t.includes('반응') || u.includes('reflex')) return 'reflex';
  if (t.includes('퍼즐') || u.includes('puzzle')) return 'slide-puzzle';

  return null;
}
