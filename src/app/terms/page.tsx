import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 이용약관 - With Sinabro (시나브로)',
  description: '시나브로(ws.ai.kr)의 서비스 이용약관 및 운영 정책에 관한 안내입니다.',
};

export default function TermsPage() {
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
          <span className="text-xs text-slate-500">최종 수정일: 2026년 11월 20일</span>
        </div>

        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">서비스 이용약관</h1>
            <p className="text-sm text-slate-400 mt-1">
              With Sinabro (시나브로) 서비스를 이용해 주시는 모든 이용자분들께 감사드립니다.
            </p>
          </div>
        </div>

        {/* 본문 섹션 */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 With Sinabro (이하 &apos;서비스&apos;)가 제공하는 모든 무료 웹 미니게임, 유틸리티 도구 및 관련 제반 서비스(이하 &apos;콘텐츠&apos;)의 이용 조건과 운영자와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">제2조 (용어의 정의)</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>
                <strong>&apos;서비스&apos;</strong>란 웹 브라우저를 통해 제공되는 시나브로의 모든 웹게임, 디지털 도구(점수판, LED 전광판 등) 및 정보 서비스를 의미합니다.
              </li>
              <li>
                <strong>&apos;이용자&apos;</strong>란 별도의 회원가입 없이 서비스에 접속하여 본 약관에 따라 시나브로의 콘텐츠를 이용하는 모든 방문객을 의미합니다.
              </li>
            </ul>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">제3조 (서비스의 제공 및 변경)</h2>
            <p className="mb-2">
              1. 시나브로는 연중무휴, 1일 24시간 안정적인 서비스 제공을 원칙으로 합니다.
            </p>
            <p className="mb-2">
              2. 서비스는 최적의 사용자 경험을 위해 새로운 미니게임의 추가, 기능 개선 또는 기존 기능의 업데이트를 수시로 진행할 수 있습니다.
            </p>
            <p>
              3. 시스템 점검, 교체, 네트워크 장애 등 부득이한 사유가 발생하는 경우 사전 공지 없이 일시적으로 서비스가 중단될 수 있습니다.
            </p>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">제4조 (이용자의 의무 및 준수사항)</h2>
            <p className="mb-2">이용자는 본 서비스를 이용함에 있어 다음 행위를 하여서는 안 됩니다:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>서비스의 정상적인 운영을 방해하거나 시스템에 과도한 부하를 유발하는 행위 (자동화 매크로, 크롤링 악용 등)</li>
              <li>제공되는 콘텐츠를 무단 복제, 변형, 재배포하여 상업적으로 이용하는 행위</li>
              <li>타인의 권리를 침해하거나 공공질서 및 미풍양속에 반하는 행위</li>
            </ul>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">제5조 (지식재산권)</h2>
            <p>
              서비스 내 모든 텍스트, 디자인, 로고, 소스코드 및 자체 제작된 미니게임 콘텐츠의 지식재산권은 시나브로에 귀속됩니다. 이용자는 개인적인 여가, 모임, 학습 목적으로 자유롭게 무료 이용할 수 있으며, 사전 승인 없는 무단 상업적 재가공은 금지됩니다.
            </p>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">제6조 (면책 조항)</h2>
            <p className="mb-2">
              1. 시나브로는 천재지변, 기간통신사업자의 회선 장애 또는 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
            </p>
            <p>
              2. 본 서비스에서 제공하는 미니게임(룰렛, 사다리타기, 복불복 등)은 단순한 오락, 여가 및 모임의 흥미를 위한 것이며, 이를 통해 발생한 이용자 간의 사적인 내기, 분쟁 또는 결과에 대해 서비스는 어떠한 법적 책임도 부담하지 않습니다.
            </p>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">제7조 (문의 및 피드백)</h2>
            <p className="mb-3">
              이용약관에 대한 질문이나 서비스 개선 제안은 언제든지 아래 연락처로 문의해 주시기 바랍니다.
            </p>
            <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg text-slate-300">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>문의 이메일: </span>
              <a href="mailto:support@ws.ai.kr" className="text-indigo-400 hover:underline">
                support@ws.ai.kr
              </a>
            </div>
          </section>
        </div>

        {/* 하단 푸터 링크 */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-500 justify-between items-center">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              사이트 소개
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
