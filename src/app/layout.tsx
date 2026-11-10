import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';

export const metadata: Metadata = {
  title: 'With Sinabro (시나브로) - 설치 없는 무료 웹 미니게임 & 시간 때우기',
  description:
    '시간 맞추기, 룰렛 돌리기, 손가락 터치 룰렛, 사다리 타기, 두더지 팡팡, 2048, 슬라이딩 퍼즐, 반사신경 테스트, 한 붓 그리기, 동물 기억력, LED 전광판 등 앱 설치 없이 웹 브라우저에서 1초 만에 즐기는 11종 무료 미니게임 플랫폼!',
  keywords: [
    '미니게임',
    '웹게임',
    '무료게임',
    '시간때우기',
    '킬링타임',
    '시간맞추기',
    '타이머게임',
    '손가락룰렛',
    '손가락터치룰렛',
    '룰렛돌리기',
    '사다리타기',
    '두더지팡팡',
    '두더지잡기',
    '2048',
    '2048게임',
    '슬라이딩퍼즐',
    '반사신경테스트',
    '한붓그리기',
    '동물기억력',
    'LED전광판',
    '1to25',
    '스피드터치',
    '그리드샷',
    'Gridshot',
    '에임테스트',
    '디지털점수판',
    '모바일점수판',
    '탁구점수판',
    '배드민턴점수판',
    '내기게임',
    '술자리게임',
    '시나브로',
    'With Sinabro',
  ],
  metadataBase: new URL('https://ws.ai.kr'),
  openGraph: {
    title: 'With Sinabro (시나브로) - 설치 없는 무료 웹 미니게임 & 시간 때우기',
    description:
      '설치 없이 브라우저로 바로 즐기는 11종의 무료 웹 미니게임! 밥값 내기, 커피 내기, 킬링타임에 딱 맞는 게임들을 만나보세요.',
    url: 'https://ws.ai.kr',
    siteName: 'With Sinabro',
    locale: 'ko_KR',
    type: 'website',
  },
  other: {
    'google-adsense-account': 'ca-pub-4819204726523615',
    'naver-site-verification': 'f43a354c16e92c6aab561c3b07a4f6baf7a3ec05',
  },
};

// 검색 엔진(구글, 네이버)을 위한 11종 게임 구조화 데이터(JSON-LD)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'With Sinabro (시나브로)',
  url: 'https://ws.ai.kr',
  applicationCategory: 'GameApplication',
  operatingSystem: 'All',
  description:
    '시간 맞추기, 룰렛, 사다리, 2048, 슬라이딩 퍼즐, 반사신경, LED 전광판 등 11종의 무료 웹 미니게임을 제공하는 플랫폼',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
  hasPart: [
    {
      '@type': 'WebApplication',
      name: '시간 맞추기 (타이머 배틀)',
      url: 'https://ws.ai.kr/?game=timer',
      description: '3.00초 정밀 타이머를 감으로 가장 가깝게 맞추는 내기 미니게임',
    },
    {
      '@type': 'WebApplication',
      name: '룰렛 돌리기',
      url: 'https://ws.ai.kr/?game=roulette',
      description: '점심 메뉴 고르기 및 벌칙 정하기를 위한 행운의 회전 룰렛 게임',
    },
    {
      '@type': 'WebApplication',
      name: '손가락 터치 룰렛',
      url: 'https://ws.ai.kr/?game=touch',
      description: '스마트폰 화면에 여러 명이 손가락을 터치해 1명을 뽑는 술자리 복불복 게임',
    },
    {
      '@type': 'WebApplication',
      name: '사다리 타기',
      url: 'https://ws.ai.kr/?game=ladder',
      description: '최대 12명까지 참여 가능한 직관적이고 공정한 클래식 사다리 타기 게임',
    },
    {
      '@type': 'WebApplication',
      name: '두더지 팡팡',
      url: 'https://ws.ai.kr/?game=mole',
      description: '튀어나오는 두더지를 빠르게 터치해 잡는 순발력 아케이드 게임',
    },
    {
      '@type': 'WebApplication',
      name: '2048 숫자 합치기',
      url: 'https://ws.ai.kr/?game=2048',
      description: '같은 숫자를 합쳐 2048 타일을 만드는 중독성 강한 두뇌 수학 퍼즐',
    },
    {
      '@type': 'WebApplication',
      name: '슬라이딩 퍼즐 (1 to 15)',
      url: 'https://ws.ai.kr/?game=puzzle',
      description: '빈 칸을 이용해 1부터 15까지 순서대로 숫자를 맞추는 전통 슬라이딩 퍼즐',
    },
    {
      '@type': 'WebApplication',
      name: '반사신경 테스트',
      url: 'https://ws.ai.kr/?game=reflex',
      description: '화면 색상이 바뀌는 순간의 반응속도를 밀리초(ms) 단위로 측정하는 동체시력 게임',
    },
    {
      '@type': 'WebApplication',
      name: '한 붓 그리기',
      url: 'https://ws.ai.kr/?game=stroke',
      description: '모든 선을 떼지 않고 한 번에 연결하는 두뇌 트레이닝 퍼즐 게임',
    },
    {
      '@type': 'WebApplication',
      name: '동물 기억력 릴레이',
      url: 'https://ws.ai.kr/?game=animal',
      description: '동물들이 나타난 순서를 기억해 똑같이 터치하는 기억력 집중력 게임',
    },
    {
      '@type': 'WebApplication',
      name: 'LED 전광판 만들기',
      url: 'https://ws.ai.kr/?game=led',
      description: '콘서트, 공항 마중, 응원용 네온 글씨가 흐르는 나만의 모바일 LED 전광판',
    },
    {
      '@type': 'WebApplication',
      name: '1 To 25 스피드 터치',
      url: 'https://ws.ai.kr/?game=speed',
      description: '무작위로 섞인 숫자를 1번부터 순서대로 최대한 빠르게 터치해 기록을 겨루는 순발력 미니 게임',
    },
    {
      '@type': 'WebApplication',
      name: '그리드샷',
      url: 'https://ws.ai.kr/?game=gridshot',
      description: '격자 공간에 무작위로 나타나는 타겟을 제한 시간 내에 빠르고 정확하게 파괴하여 점수와 반응속도를 측정하는 순발력 슈팅 미니 게임',
    },
    {
      '@type': 'WebApplication',
      name: '디지털 점수판',
      url: 'https://ws.ai.kr/?game=scoreboard',
      description: '운동 경기나 각종 모임 내기에서 스마트폰을 가로로 거치해 세트와 점수를 직관적으로 기록하는 모바일 최적화 점수판',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <meta name="naver-site-verification" content="f43a354c16e92c6aab561c3b07a4f6baf7a3ec05" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4819204726523615"
          crossOrigin="anonymous"
        />
        {/* 구글 & 네이버 검색엔진 최적화를 위한 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 text-[12px] antialiased min-h-screen">
        <AuthProvider>
          <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
