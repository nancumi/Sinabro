'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Gamepad2,
  Zap,
  Brain,
  Wrench,
  ShieldCheck,
  Smartphone,
  Users,
  Coffee,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const PlatformGuideSection: React.FC = () => {
  return (
    <article className="w-full mt-8 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-10 text-slate-300">
      {/* 1. 플랫폼 히어로 타이틀 */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> 올인원 무료 웹 미니게임 & 유틸리티 플랫폼
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          With Sinabro (시나브로)와 함께하는 스마트한 시간
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          &apos;모르는 사이에 조금씩 조금씩&apos;이라는 순우리말처럼, 일상 속 자투리 시간과 소중한 모임의 순간을 즐거움과 편리함으로 채워드리는 무설치 웹 플랫폼입니다. 별도의 앱 다운로드나 회원가입 없이 링크 하나로 즉시 실행됩니다.
        </p>
      </div>

      {/* 2. 핵심 카테고리 4분야 상세 소개 */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-sky-400" />
            <span>시나브로 핵심 카테고리 안내</span>
          </h3>
          <span className="text-xs text-slate-500">15종 이상의 인터랙티브 웹 도구</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 복불복 & 내기 */}
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Coffee className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">복불복 & 내기 게임</h4>
                <p className="text-[11px] text-slate-500">시간 맞추기, 손가락 룰렛, 원판 룰렛, 사다리 타기</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              점심 식사 후 커피 쏘기, 설거지 당번 정하기, 모임 벌칙자 뽑기 등 결정이 필요한 순간 가장 공정하고 박진감 넘치는 추첨을 지원합니다.
            </p>
          </div>

          {/* 순발력 & 반응속도 */}
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">순발력 & 반응속도 대결</h4>
                <p className="text-[11px] text-slate-500">반사신경 테스트(ms), 1 to 25 스피드 터치, 에임 그리드샷, 두더지 팡팡</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              밀리초(1/1000초) 단위로 신호 반응속도를 측정하고 손가락 순발력을 테스트하여 잠들어 있는 뇌와 반사신경을 즉각 깨워줍니다.
            </p>
          </div>

          {/* 두뇌 & 퍼즐 */}
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Brain className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">두뇌 & 퍼즐 트레이닝</h4>
                <p className="text-[11px] text-slate-500">2048 숫자 퍼즐, 15 슬라이딩 퍼즐, 한붓 그리기, 동물 기억력</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              남녀노소 누구나 즐길 수 있는 논리 수학 퍼즐과 위상수학 한붓 그리기, 단기 기억력 테스트로 지적 즐거움과 집중력을 함께 높여줍니다.
            </p>
          </div>

          {/* 실생활 유틸리티 */}
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Wrench className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">모임 & 스포츠 실생활 도구</h4>
                <p className="text-[11px] text-slate-500">디지털 점수판, LED 응원 전광판, 게임/체스 대국 타이머</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              스포츠 경기(탁구, 배드민턴) 점수판부터 콘서트 응원 네온 전광판, 보드게임 시간 관리 타이머까지 실생활에 꼭 필요한 편의 도구를 제공합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 왜 시나브로인가? 3대 핵심 장점 */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>시나브로 플랫폼의 3대 핵심 가치</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/70 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">다운로드 0초 무설치 웹</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              용량 차지 없는 순수 웹 표준(HTML5/Canvas) 구현으로 스마트폰, 태블릿, PC 어디서나 브라우저 접속 즉시 시작됩니다.
            </p>
          </div>

          <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/70 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">회원가입 없는 프라이버시</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              불필요한 개인정보 수집이나 회원가입 절차 없이, 방문객 모두가 모든 기능을 100% 무료로 안심하고 사용할 수 있습니다.
            </p>
          </div>

          <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/70 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">다자간 오프라인 모임 최적화</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              멀티터치 손가락 룰렛, 참가자별 타이머 배틀, 세트 스코어보드 등 함께 모였을 때 가장 빛나는 인터랙션을 선사합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 4. 플랫폼 자주 묻는 질문 (FAQ) */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>시나브로 이용 자주 묻는 질문</span>
        </h3>

        <div className="space-y-3">
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <h4 className="font-bold text-white text-xs sm:text-sm">
              Q. PC와 모바일 모두에서 완벽하게 호환되나요?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              네! 모바일 터치 인터랙션과 PC 키보드/마우스 컨트롤을 모두 지원하는 반응형 웹으로 설계되어 있습니다.
            </p>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <h4 className="font-bold text-white text-xs sm:text-sm">
              Q. 게임 기록이나 설정이 초기화되지 않고 저장되나요?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              네. 전광판 문구, 룰렛 항목, 점수판 점수 등은 브라우저 로컬 저장소에 안전하게 유지되므로 재접속 시에도 편리하게 이어서 사용할 수 있습니다.
            </p>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <h4 className="font-bold text-white text-xs sm:text-sm">
              Q. 새로운 기능 제안이나 피드백을 전달하려면 어떻게 하나요?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              사이트 하단 &apos;문의하기&apos; 메뉴나 <a href="mailto:jiyulain@gmail.com" className="text-sky-400 underline">jiyulain@gmail.com</a>로 편하게 의견을 보내주시면 신규 기능 개발에 적극 반영됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 5. 정책 바로가기 링크 바 */}
      <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-sky-400 transition-colors flex items-center gap-1">
            <span>사이트 소개</span> <ArrowRight className="w-3 h-3" />
          </Link>
          <Link href="/privacy" className="hover:text-sky-400 transition-colors flex items-center gap-1">
            <span>개인정보처리방침</span> <ArrowRight className="w-3 h-3" />
          </Link>
          <Link href="/terms" className="hover:text-sky-400 transition-colors flex items-center gap-1">
            <span>서비스 이용약관</span> <ArrowRight className="w-3 h-3" />
          </Link>
          <Link href="/contact" className="hover:text-sky-400 transition-colors flex items-center gap-1">
            <span>문의 및 제휴</span> <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <span className="text-slate-500">With Sinabro Web Platform</span>
      </div>
    </article>
  );
};
