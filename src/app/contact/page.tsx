import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기 (Contact Us) - With Sinabro (시나브로)',
  description: '시나브로(ws.ai.kr) 서비스에 대한 피드백, 제휴 문의, 버그 제보 창구입니다.',
};

export default function ContactPage() {
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
          <span className="text-xs text-slate-500">With Sinabro Support</span>
        </div>

        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">문의 및 피드백</h1>
            <p className="text-sm text-slate-400 mt-1">
              시나브로를 이용하시면서 겪으신 불편이나 새로운 게임 제안, 제휴 문의를 남겨주세요.
            </p>
          </div>
        </div>

        {/* 본문 콘텐츠 */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          {/* 공식 이메일 안내 카드 */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-xl border border-slate-800 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 text-xs font-semibold mb-2">
                  공식 고객 지원 채널
                </span>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-400" /> jiyulain@gmail.com
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  모든 문의 사항은 영업일 기준 24~48시간 이내에 면밀히 검토 후 회신드립니다.
                </p>
              </div>
              <a
                href="mailto:jiyulain@gmail.com"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-sky-500/20"
              >
                이메일 보내기
              </a>
            </div>
          </section>

          {/* 문의 유형 가이드 */}
          <section className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-400" /> 자주 접수되는 문의 유형
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                <h3 className="font-bold text-slate-200 mb-1.5">🐛 버그 & 오류 제보</h3>
                <p className="text-xs text-slate-400">
                  특정 모바일 기기나 브라우저에서 게임 화면이 깨지거나 소리가 나지 않는 현상을 알려주세요. 기기 기종 및 브라우저 정보를 함께 적어주시면 빠른 해결에 큰 도움이 됩니다.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                <h3 className="font-bold text-slate-200 mb-1.5">💡 새 기능 & 게임 건의</h3>
                <p className="text-xs text-slate-400">
                  &quot;이런 미니게임이나 내기 도구가 있으면 좋겠어요!&quot; 하는 아이디어를 자유롭게 제안해 주세요. 검토 후 신규 콘텐츠로 적극 반영합니다.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                <h3 className="font-bold text-slate-200 mb-1.5">🤝 협업 & 광고 제휴</h3>
                <p className="text-xs text-slate-400">
                  시나브로 플랫폼과의 콘텐츠 제휴, 배너 협업, 단체 행사용 커스텀 기능 제작 문의 등을 환영합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 간단 FAQ */}
          <section className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" /> 자주 묻는 질문 (FAQ)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-200 text-sm">Q. 시나브로의 모든 기능은 정말 무료인가요?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  네, 시나브로의 15종 이상의 모든 웹 미니게임과 유틸리티 도구는 일체의 과금이나 결제 없이 100% 무료로 개방되어 있습니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm">Q. 모바일 홈 화면에 바로가기로 추가할 수 있나요?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  네! 모바일 사파리(Safari)나 크롬(Chrome) 브라우저의 공유 메뉴에서 [홈 화면에 추가]를 누르시면 앱처럼 아이콘 하나로 바로 접속하실 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm">Q. 개인정보나 로그인 정보가 서버에 저장되나요?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  아닙니다. 시나브로는 이용자의 어떠한 개인 식별 정보도 수집하거나 저장하지 않으며, 게임 내 설정이나 전광판 문구는 이용자의 기기 내부(브라우저 저장소)에만 안전하게 보관됩니다.
                </p>
              </div>
            </div>
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
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              사이트 소개
            </Link>
          </div>
          <div>© With Sinabro. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
