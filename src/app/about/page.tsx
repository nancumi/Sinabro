import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle, Zap, Shield, Heart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '사이트 소개 (About Us) - With Sinabro (시나브로)',
  description: '앱 설치 없이 1초 만에 즐기는 스마트한 웹 미니게임 & 모임 유틸리티 플랫폼 시나브로를 소개합니다.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 홈으로 돌아가기
          </Link>
          <span className="text-xs text-slate-500">With Sinabro</span>
        </div>

        {/* 메인 히어로 */}
        <div className="text-center py-6 border-b border-slate-800 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> 스마트하게 즐기는 시간 때우기 & 모임 도구
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            With Sinabro (시나브로)
          </h1>
          <p className="mt-3 text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            &apos;모르는 사이에 조금씩 조금씩&apos;이라는 순우리말 &apos;시나브로&apos;처럼, 일상 속 자투리 시간과 소중한 모임의 순간을 즐거움과 편리함으로 채워드리는 무료 웹 플랫폼입니다.
          </p>
        </div>

        {/* 본문 소개 */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> 시나브로의 탄생 배경과 가치
            </h2>
            <p className="mb-3">
              친구들과 밥을 먹고 커피 내기를 할 때, 동아리 모임에서 순서를 정할 때, 점심시간 5분의 지루함을 달랠 때마다 복잡한 앱을 다운로드하거나 귀찮은 회원가입을 거쳐야 했던 불편함에서 시작되었습니다.
            </p>
            <p>
              시나브로는 **&quot;다운로드 0초, 로그인 0초, 비용 0원&quot;**이라는 원칙 아래, 누구나 모바일과 PC 웹 브라우저에서 URL 접속만으로 즉시 구동되는 고품질 웹 게임과 유용한 모임 유틸리티를 제작·제공합니다.
            </p>
          </section>

          {/* 핵심 제공 서비스 */}
          <section className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> 시나브로가 제공하는 4대 핵심 분야
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-sky-300 mb-1">🎯 복불복 & 내기 게임</h3>
                <p className="text-xs text-slate-400">
                  시간 맞추기(타이머 배틀), 손가락 터치 룰렛, 원판 룰렛 돌리기, 사다리 타기 등 공정하고 긴장감 넘치는 모임 전용 게임
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-purple-300 mb-1">⚡ 순발력 & 반응속도</h3>
                <p className="text-xs text-slate-400">
                  밀리초(ms) 단위 반사신경 테스트, 1 to 25 스피드 터치, 에임 집중력 그리드샷, 두더지 팡팡 등 뇌 활력 트레이닝
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-emerald-300 mb-1">🧩 두뇌 & 퍼즐</h3>
                <p className="text-xs text-slate-400">
                  2048 숫자 합치기 퍼즐, 15 슬라이딩 퍼즐, 한붓 그리기, 동물 기억력 카드 매칭 등 남녀노소 즐기는 전략 퍼즐
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-amber-300 mb-1">🛠️ 실생활 & 모임 유틸리티</h3>
                <p className="text-xs text-slate-400">
                  탁구·배드민턴·보드게임용 디지털 점수판, 콘서트·응원용 대형 LED 전광판, 체스·바둑용 대국 타이머 등
                </p>
              </div>
            </div>
          </section>

          {/* 기술 및 운영 철학 */}
          <section className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-400" /> 기술 혁신 및 사용자 보호 철학
            </h2>
            <ul className="space-y-2 text-slate-400 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>최신 웹 기술 적용:</strong> Next.js 최신 런타임, React 19, 경량화된 HTML5 Canvas 기술을 결합하여 저사양 기기나 불안정한 네트워크에서도 0.1초 내외의 빠른 로딩을 보장합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>개인정보 비수집 원칙:</strong> 회원가입이나 개인정보 입력을 일절 요구하지 않으며, 이용자의 프라이버시를 최우선으로 존중합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span>
                  <strong>쾌적한 사용자 경험:</strong> 방해되는 팝업 광고나 강제 클릭을 지양하고, 사용자가 콘텐츠에 온전히 집중할 수 있는 환경을 만듭니다.
                </span>
              </li>
            </ul>
          </section>

          {/* 소통 및 연락 */}
          <section className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" /> 이용자와 함께 만들어가는 시나브로
            </h2>
            <p className="mb-2">
              시나브로는 이용자 여러분의 아이디어와 피드백으로 계속해서 진화합니다. 원하시는 새로운 미니게임이나 유틸리티 기능, 버그 제보가 있다면 언제든지 편하게 전해 주세요.
            </p>
            <p className="text-slate-400">
              담당자 문의: <a href="mailto:jiyulain@gmail.com" className="text-sky-400 hover:underline font-medium">jiyulain@gmail.com</a>
            </p>
          </section>
        </div>

        {/* 하단 푸터 링크 */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-500 justify-between items-center">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              서비스 이용약관
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              문의하기
            </Link>
          </div>
          <div>© With Sinabro. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
