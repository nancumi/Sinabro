import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 - With Sinabro (시나브로)',
  description: '시나브로(ws.ai.kr)의 개인정보처리방침 및 구글 애드센스 쿠키 정책 안내입니다.',
};

export default function PrivacyPage() {
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
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">개인정보처리방침</h1>
            <p className="text-sm text-slate-400 mt-1">
              With Sinabro (시나브로, 이하 &apos;서비스&apos;)는 이용자의 개인정보를 중요시하며 관련 법령을 준수합니다.
            </p>
          </div>
        </div>

        {/* 본문 섹션 */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">1. 수집하는 개인정보 항목 및 수집 방법</h2>
            <p className="mb-2">
              시나브로는 회원가입이나 로그인 없이 모든 미니게임과 유틸리티를 자유롭게 이용할 수 있는 웹 플랫폼입니다. 따라서 이름, 주민등록번호, 연락처 등 직접적인 개인 식별 정보를 수집하지 않습니다.
            </p>
            <p>서비스 품질 향상 및 통계 분석을 위해 아래 항목이 자동으로 생성되어 수집될 수 있습니다:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>접속 기기 환경 (PC, 모바일, 태블릿 등 기기 유형)</li>
              <li>브라우저 유형 및 운영체제(OS) 정보</li>
              <li>방문 일시, 서비스 내 콘텐츠 이용 시간(체류 시간) 및 이용 페이지</li>
              <li>유입 경로(Referrer) 및 익명화된 세션 식별자</li>
            </ul>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">2. 개인정보의 이용 목적</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>서비스 제공 및 콘텐츠(미니게임, 도구 등) 안정적 구동</li>
              <li>콘텐츠별 인기도 및 체류 시간 통계 분석을 통한 서비스 개선</li>
              <li>비정상적인 트래픽 및 어뷰징 방지, 시스템 안정성 확보</li>
            </ul>
          </section>

          <section className="bg-sky-950/20 p-5 rounded-xl border border-sky-500/20">
            <h2 className="text-base font-bold text-sky-300 mb-3">
              3. 쿠키(Cookie) 및 구글 애드센스(Google AdSense) 광고 관련 안내
            </h2>
            <p className="mb-2">
              본 웹사이트는 이용자 맞춤형 광고 게재 및 트래픽 분석을 위해 구글(Google LLC)을 포함한 제3자 광고 사업자의 서비스를 이용할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 mt-2">
              <li>
                <strong>구글 광고 쿠키 사용:</strong> Google을 비롯한 제3자 공급업체는 쿠키를 사용하여 이용자가 본 웹사이트 또는 다른 웹사이트를 과거에 방문한 이력을 바탕으로 광고를 게재합니다.
              </li>
              <li>
                <strong>광고 맞춤설정:</strong> Google의 광고 쿠키 사용을 통해 Google 및 파트너는 인터넷 방문 기록을 기반으로 적절한 광고를 제공할 수 있습니다.
              </li>
              <li>
                <strong>맞춤설정 거부 안내:</strong> 이용자는 언제든지 Google의{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline hover:text-sky-300"
                >
                  광고 설정(Ads Settings)
                </a>
                을 방문하여 맞춤설정된 광고 게재를 선택 해제할 수 있습니다. 또한{' '}
                <a
                  href="http://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline hover:text-sky-300"
                >
                  www.aboutads.info
                </a>
                를 통해 제3자 공급업체의 맞춤 광고용 쿠키 사용을 차단하실 수 있습니다.
              </li>
              <li>
                <strong>브라우저 쿠키 거부:</strong> 웹 브라우저 상단 [도구] &gt; [설정] &gt; [개인정보 및 보안] 메뉴에서 쿠키 저장을 거부하거나 삭제할 수 있습니다. 다만 쿠키 저장을 거부할 경우 일부 서비스 기능 이용에 제약이 따를 수 있습니다.
              </li>
            </ul>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">4. 개인정보의 보유 및 파기 절차</h2>
            <p>
              시나브로는 수집된 통계 및 로그 데이터를 처리 목적 달성 시 즉시 파기하거나, 통계 분석 목적에 한하여 익명화된 상태로 안전하게 보관합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
            </p>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">5. 이용자의 권리 및 행사 방법</h2>
            <p>
              이용자는 언제든지 로컬 저장소(LocalStorage/SessionStorage) 및 브라우저 쿠키를 삭제함으로써 기기에 저장된 서비스 관련 데이터를 제거할 권리를 가집니다.
            </p>
          </section>

          <section className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            <h2 className="text-base font-bold text-white mb-3">6. 개인정보 보호책임자 및 문의처</h2>
            <p className="mb-3">
              개인정보 보호와 관련한 문의, 불만 처리, 의견 수렴 등은 아래의 담당자 이메일로 연락해 주시면 신속하게 답변해 드리겠습니다.
            </p>
            <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg text-slate-300">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>문의 이메일: </span>
              <a href="mailto:jiyulain@gmail.com" className="text-sky-400 hover:underline">
                jiyulain@gmail.com
              </a>
            </div>
          </section>
        </div>

        {/* 하단 푸터 링크 */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-500 justify-between items-center">
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              서비스 이용약관
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
