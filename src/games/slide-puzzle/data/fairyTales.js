// 이솝 우화 5대 테마: 명확한 외곽선과 따뜻하고 선명한 동화책 삽화 (800x800)
function svgToDataUrl(svgStr) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr.trim())}`;
}

export const FAIRY_TALES = [
  {
    title: '여우와 신포도',
    subtitle: '이솝 우화 · 포도 넝쿨과 여우',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- 배경 -->
        <rect width="800" height="800" fill="#fef3c7" />
        <circle cx="700" cy="120" r="80" fill="#fde047" opacity="0.6" />
        <rect y="640" width="800" height="160" fill="#86efac" rx="20" />
        <path d="M0,660 Q200,600 400,640 T800,630 L800,800 L0,800 Z" fill="#4ade80" />

        <!-- 포도나무 넝쿨 -->
        <path d="M-20,100 Q200,60 400,120 T820,80" stroke="#78350f" stroke-width="24" fill="none" stroke-linecap="round" />
        <path d="M220,100 Q260,240 240,320" stroke="#78350f" stroke-width="14" fill="none" />
        <path d="M520,90 Q560,200 540,280" stroke="#78350f" stroke-width="14" fill="none" />
        
        <!-- 나뭇잎들 -->
        <ellipse cx="180" cy="80" rx="55" ry="35" fill="#15803d" transform="rotate(-15 180 80)" />
        <ellipse cx="320" cy="110" rx="60" ry="40" fill="#16a34a" transform="rotate(20 320 110)" />
        <ellipse cx="460" cy="80" rx="50" ry="35" fill="#15803d" transform="rotate(-10 460 80)" />
        <ellipse cx="620" cy="100" rx="60" ry="38" fill="#16a34a" transform="rotate(15 620 100)" />

        <!-- 탐스러운 보라색 포도송이 1 -->
        <g transform="translate(180, 220)">
          <circle cx="40" cy="40" r="28" fill="#7e22ce" stroke="#581c87" stroke-width="3" />
          <circle cx="85" cy="40" r="28" fill="#9333ea" stroke="#581c87" stroke-width="3" />
          <circle cx="130" cy="40" r="28" fill="#7e22ce" stroke="#581c87" stroke-width="3" />
          <circle cx="62" cy="82" r="28" fill="#a855f7" stroke="#581c87" stroke-width="3" />
          <circle cx="108" cy="82" r="28" fill="#7e22ce" stroke="#581c87" stroke-width="3" />
          <circle cx="85" cy="125" r="28" fill="#9333ea" stroke="#581c87" stroke-width="3" />
        </g>

        <!-- 포도송이 2 -->
        <g transform="translate(480, 180)">
          <circle cx="40" cy="40" r="26" fill="#9333ea" stroke="#581c87" stroke-width="3" />
          <circle cx="85" cy="40" r="26" fill="#7e22ce" stroke="#581c87" stroke-width="3" />
          <circle cx="62" cy="80" r="26" fill="#a855f7" stroke="#581c87" stroke-width="3" />
        </g>

        <!-- 귀여운 주황 여우 캐릭터 -->
        <!-- 꼬리 -->
        <path d="M220,680 C120,670 110,500 240,460 C260,520 280,620 220,680 Z" fill="#ea580c" stroke="#c2410c" stroke-width="4" />
        <path d="M140,510 C180,480 230,470 240,460 C230,500 210,530 180,545 Z" fill="#ffffff" />

        <!-- 여우 몸통 -->
        <ellipse cx="360" cy="600" rx="95" ry="115" fill="#ea580c" stroke="#c2410c" stroke-width="4" />
        <!-- 하얀 배 -->
        <ellipse cx="375" cy="610" rx="55" ry="80" fill="#ffffff" />

        <!-- 발 -->
        <ellipse cx="320" cy="710" rx="30" ry="20" fill="#431407" />
        <ellipse cx="410" cy="710" rx="30" ry="20" fill="#431407" />

        <!-- 여우 머리 (위를 쳐다봄) -->
        <g transform="translate(390, 420) rotate(-15)">
          <!-- 귀 -->
          <polygon points="-50,-30 -85,-130 -10,-60" fill="#ea580c" stroke="#c2410c" stroke-width="4" />
          <polygon points="-45,-40 -70,-115 -18,-65" fill="#fed7aa" />
          <polygon points="30,-40 70,-130 65,-50" fill="#ea580c" stroke="#c2410c" stroke-width="4" />
          <polygon points="35,-45 62,-115 58,-55" fill="#fed7aa" />
          
          <!-- 얼굴 볼 -->
          <ellipse cx="0" cy="0" rx="75" ry="65" fill="#ea580c" stroke="#c2410c" stroke-width="4" />
          <!-- 흰 뺨 -->
          <path d="M-75,10 Q-30,60 0,65 Q30,60 75,10 Q50,75 0,75 Q-50,75 -75,10 Z" fill="#ffffff" />
          <!-- 눈 (포도를 쳐다봄) -->
          <ellipse cx="-25" cy="-10" rx="9" ry="13" fill="#1e293b" />
          <circle cx="-22" cy="-14" r="3.5" fill="#ffffff" />
          <ellipse cx="25" cy="-10" rx="9" ry="13" fill="#1e293b" />
          <circle cx="28" cy="-14" r="3.5" fill="#ffffff" />
          <!-- 코 -->
          <ellipse cx="0" cy="28" rx="14" ry="10" fill="#1e293b" />
          <!-- 미소 입 -->
          <path d="M-10,44 Q0,54 10,44" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round" />
        </g>
      </svg>
    `)
  },
  {
    title: '토끼와 거북이',
    subtitle: '이솝 우화 · 숲속 달리기 경주',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- 배경 -->
        <rect width="800" height="800" fill="#e0f2fe" />
        <!-- 구름 -->
        <circle cx="160" cy="140" r="50" fill="#ffffff" />
        <circle cx="210" cy="130" r="60" fill="#ffffff" />
        <circle cx="260" cy="145" r="45" fill="#ffffff" />
        <circle cx="620" cy="160" r="55" fill="#ffffff" />
        <circle cx="670" cy="150" r="65" fill="#ffffff" />

        <!-- 푸른 언덕 경주로 -->
        <path d="M0,480 Q250,420 500,480 T800,460 L800,800 L0,800 Z" fill="#86efac" />
        <path d="M0,580 Q400,520 800,570 L800,800 L0,800 Z" fill="#4ade80" />
        <!-- 결승선 깃발 -->
        <line x1="720" y1="360" x2="720" y2="600" stroke="#78350f" stroke-width="8" stroke-linecap="round" />
        <polygon points="720,370 790,405 720,440" fill="#ef4444" stroke="#b91c1c" stroke-width="3" />

        <!-- 나무 아래 자고 있는 토끼 (좌측) -->
        <!-- 나무 기둥과 그늘 -->
        <rect x="60" y="240" width="70" height="360" fill="#92400e" rx="10" />
        <circle cx="95" cy="200" r="110" fill="#15803d" />
        <circle cx="45" cy="160" r="80" fill="#16a34a" />
        <circle cx="150" cy="170" r="85" fill="#16a34a" />

        <!-- 쿨쿨 자는 토끼 -->
        <ellipse cx="170" cy="560" rx="65" ry="45" fill="#fbcfe8" stroke="#f472b6" stroke-width="4" />
        <circle cx="125" cy="540" r="40" fill="#fbcfe8" stroke="#f472b6" stroke-width="4" />
        <!-- 귀 (누워있음) -->
        <ellipse cx="90" cy="495" rx="45" ry="16" fill="#fbcfe8" stroke="#f472b6" stroke-width="4" transform="rotate(-30 90 495)" />
        <ellipse cx="90" cy="495" rx="35" ry="8" fill="#f43f5e" opacity="0.4" transform="rotate(-30 90 495)" />
        <ellipse cx="80" cy="520" rx="40" ry="15" fill="#fbcfe8" stroke="#f472b6" stroke-width="4" transform="rotate(-15 80 520)" />
        <!-- 감은 눈 (zZZ) -->
        <path d="M110,540 Q118,548 126,540" stroke="#831843" stroke-width="3.5" fill="none" stroke-linecap="round" />
        <text x="140" y="470" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ec4899">z</text>
        <text x="160" y="445" font-family="sans-serif" font-size="34" font-weight="bold" fill="#ec4899">Z</text>

        <!-- 열심히 달리는 거북이 (우측) -->
        <!-- 거북이 등껍질 -->
        <path d="M440,640 C440,510 600,510 600,640 Z" fill="#15803d" stroke="#14532d" stroke-width="5" />
        <!-- 등껍질 무늬 -->
        <polygon points="520,535 555,565 540,605 500,605 485,565" fill="#16a34a" stroke="#14532d" stroke-width="3" />
        <line x1="520" y1="535" x2="520" y2="512" stroke="#14532d" stroke-width="3" />
        <line x1="555" y1="565" x2="585" y2="560" stroke="#14532d" stroke-width="3" />
        <line x1="540" y1="605" x2="570" y2="625" stroke="#14532d" stroke-width="3" />
        <line x1="500" y1="605" x2="470" y2="625" stroke="#14532d" stroke-width="3" />
        <line x1="485" y1="565" x2="455" y2="560" stroke="#14532d" stroke-width="3" />

        <!-- 머리 (앞을 보며 씩씩하게 미소) -->
        <circle cx="635" cy="590" r="38" fill="#86efac" stroke="#16a34a" stroke-width="4" />
        <!-- 눈 -->
        <circle cx="645" cy="580" r="6" fill="#0f172a" />
        <circle cx="647" cy="578" r="2" fill="#ffffff" />
        <!-- 땀방울(열심) -->
        <path d="M625,545 C625,535 635,535 635,545 C635,552 625,552 625,545 Z" fill="#38bdf8" />
        <!-- 발 -->
        <ellipse cx="460" cy="650" rx="28" ry="16" fill="#86efac" stroke="#16a34a" stroke-width="3.5" />
        <ellipse cx="580" cy="650" rx="28" ry="16" fill="#86efac" stroke="#16a34a" stroke-width="3.5" />
        <!-- 꼬리 -->
        <polygon points="440,630 415,635 440,642" fill="#86efac" />
      </svg>
    `)
  },
  {
    title: '사자와 생쥐',
    subtitle: '이솝 우화 · 위대한 친구',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- 배경 -->
        <rect width="800" height="800" fill="#fed7aa" />
        <circle cx="400" cy="400" r="360" fill="#ffedd5" />

        <!-- 커다랗고 둥글둥글한 사자 갈기 -->
        <g id="mane">
          <circle cx="400" cy="420" r="230" fill="#b45309" stroke="#78350f" stroke-width="5" />
          <circle cx="300" cy="240" r="65" fill="#d97706" />
          <circle cx="400" cy="210" r="70" fill="#d97706" />
          <circle cx="500" cy="240" r="65" fill="#d97706" />
          <circle cx="210" cy="340" r="65" fill="#d97706" />
          <circle cx="590" cy="340" r="65" fill="#d97706" />
          <circle cx="200" cy="450" r="65" fill="#d97706" />
          <circle cx="600" cy="450" r="65" fill="#d97706" />
          <circle cx="250" cy="560" r="65" fill="#d97706" />
          <circle cx="550" cy="560" r="65" fill="#d97706" />
          <circle cx="350" cy="620" r="65" fill="#d97706" />
          <circle cx="450" cy="620" r="65" fill="#d97706" />
        </g>

        <!-- 사자 귀 -->
        <circle cx="270" cy="290" r="40" fill="#f59e0b" stroke="#78350f" stroke-width="4" />
        <circle cx="270" cy="290" r="24" fill="#fde68a" />
        <circle cx="530" cy="290" r="40" fill="#f59e0b" stroke="#78350f" stroke-width="4" />
        <circle cx="530" cy="290" r="24" fill="#fde68a" />

        <!-- 사자 얼굴 -->
        <circle cx="400" cy="430" r="150" fill="#fbbf24" stroke="#b45309" stroke-width="4" />

        <!-- 눈 (따뜻한 미소) -->
        <ellipse cx="345" cy="400" rx="16" ry="22" fill="#451a03" />
        <circle cx="340" cy="392" r="6" fill="#ffffff" />
        <ellipse cx="455" cy="400" rx="16" ry="22" fill="#451a03" />
        <circle cx="450" cy="392" r="6" fill="#ffffff" />

        <!-- 코와 입 (주둥이) -->
        <ellipse cx="370" cy="485" rx="35" ry="28" fill="#fef3c7" />
        <ellipse cx="430" cy="485" rx="35" ry="28" fill="#fef3c7" />
        <polygon points="380,445 420,445 400,470" fill="#78350f" rx="6" />
        <path d="M375,490 Q400,515 425,490" stroke="#78350f" stroke-width="4" fill="none" stroke-linecap="round" />
        <!-- 수염 -->
        <line x1="330" y1="475" x2="270" y2="465" stroke="#78350f" stroke-width="3" stroke-linecap="round" />
        <line x1="330" y1="490" x2="265" y2="495" stroke="#78350f" stroke-width="3" stroke-linecap="round" />
        <line x1="470" y1="475" x2="530" y2="465" stroke="#78350f" stroke-width="3" stroke-linecap="round" />
        <line x1="470" y1="490" x2="535" y2="495" stroke="#78350f" stroke-width="3" stroke-linecap="round" />

        <!-- 사자 머리 위 귀여운 꼬마 생쥐 -->
        <g transform="translate(370, 180)">
          <!-- 생쥐 꼬리 -->
          <path d="M-15,45 Q-40,25 -25,10" stroke="#94a3b8" stroke-width="4" fill="none" stroke-linecap="round" />
          <!-- 몸 -->
          <ellipse cx="15" cy="40" rx="32" ry="24" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
          <!-- 귀 -->
          <circle cx="38" cy="18" r="14" fill="#fbcfe8" stroke="#64748b" stroke-width="2.5" />
          <!-- 머리 -->
          <circle cx="38" cy="35" r="18" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
          <circle cx="44" cy="32" r="3.5" fill="#0f172a" />
          <circle cx="56" cy="37" r="3" fill="#f43f5e" />
        </g>
      </svg>
    `)
  },
  {
    title: '까마귀와 물항아리',
    subtitle: '이솝 우화 · 지혜로운 까마귀',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- 배경 -->
        <rect width="800" height="800" fill="#f0fdf4" />
        <rect y="600" width="800" height="200" fill="#fde68a" />
        
        <!-- 커다란 도자기 물항아리 -->
        <g id="pitcher" transform="translate(420, 260)">
          <!-- 입구 -->
          <ellipse cx="110" cy="50" rx="55" ry="18" fill="#bae6fd" stroke="#0284c7" stroke-width="6" />
          <!-- 목 -->
          <path d="M70,50 L75,130 Q30,220 30,340 C30,420 190,420 190,340 Q190,220 145,130 L150,50" fill="#e0f2fe" stroke="#0284c7" stroke-width="6" />
          
          <!-- 차오르는 파란 물 -->
          <path d="M40,320 C40,405 180,405 180,320 Q180,240 145,180 L75,180 Q40,240 40,320 Z" fill="#38bdf8" opacity="0.8" />
          <ellipse cx="110" cy="180" rx="35" ry="10" fill="#7dd3fc" />

          <!-- 물속의 조약돌들 -->
          <circle cx="90" cy="360" r="18" fill="#94a3b8" />
          <circle cx="130" cy="355" r="22" fill="#64748b" />
          <circle cx="105" cy="330" r="16" fill="#a1a1aa" />
        </g>

        <!-- 지혜로운 까마귀 캐릭터 (좌측 상단에서 조약돌을 물고 날아옴) -->
        <g transform="translate(180, 220)">
          <!-- 몸통 -->
          <ellipse cx="120" cy="120" rx="80" ry="60" fill="#1e293b" stroke="#0f172a" stroke-width="4" transform="rotate(-15 120 120)" />
          <!-- 날개 -->
          <path d="M60,110 C40,40 140,40 130,110 Z" fill="#334155" stroke="#0f172a" stroke-width="3" />
          
          <!-- 머리 -->
          <circle cx="190" cy="85" r="45" fill="#1e293b" stroke="#0f172a" stroke-width="4" />
          <!-- 눈 -->
          <circle cx="205" cy="75" r="10" fill="#ffffff" />
          <circle cx="208" cy="75" r="5" fill="#0f172a" />
          
          <!-- 노란 부리 -->
          <polygon points="230,70 300,90 230,105" fill="#eab308" stroke="#ca8a04" stroke-width="3" />
          <!-- 부리에 물린 조약돌 -->
          <ellipse cx="270" cy="100" rx="16" ry="12" fill="#ef4444" stroke="#b91c1c" stroke-width="2.5" />
          
          <!-- 꼬리 깃털 -->
          <polygon points="50,140 0,165 30,185 70,150" fill="#0f172a" />
          <!-- 다리 -->
          <line x1="120" y1="175" x2="115" y2="215" stroke="#d97706" stroke-width="5" stroke-linecap="round" />
          <line x1="145" y1="170" x2="145" y2="215" stroke="#d97706" stroke-width="5" stroke-linecap="round" />
        </g>

        <!-- 바닥에 흩어진 알록달록 조약돌들 -->
        <circle cx="280" cy="670" r="22" fill="#f87171" stroke="#dc2626" stroke-width="3" />
        <circle cx="340" cy="685" r="26" fill="#fb923c" stroke="#ea580c" stroke-width="3" />
        <circle cx="410" cy="690" r="20" fill="#a78bfa" stroke="#7c3aed" stroke-width="3" />
        <circle cx="680" cy="680" r="24" fill="#38bdf8" stroke="#0284c7" stroke-width="3" />
        <circle cx="735" cy="670" r="18" fill="#4ade80" stroke="#16a34a" stroke-width="3" />
      </svg>
    `)
  },
  {
    title: '시골 쥐와 서울 쥐',
    subtitle: '이솝 우화 · 달콤한 치즈 만찬',
    url: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <!-- 배경 -->
        <rect width="800" height="800" fill="#fff1f2" />
        <!-- 식탁 테이블 보 (격자 체크무늬) -->
        <rect y="460" width="800" height="340" fill="#fecdd3" />
        <line x1="0" y1="520" x2="800" y2="520" stroke="#fda4af" stroke-width="4" />
        <line x1="0" y1="600" x2="800" y2="600" stroke="#fda4af" stroke-width="4" />
        <line x1="0" y1="680" x2="800" y2="680" stroke="#fda4af" stroke-width="4" />
        <line x1="160" y1="460" x2="160" y2="800" stroke="#fda4af" stroke-width="4" />
        <line x1="360" y1="460" x2="360" y2="800" stroke="#fda4af" stroke-width="4" />
        <line x1="560" y1="460" x2="560" y2="800" stroke="#fda4af" stroke-width="4" />
        <line x1="760" y1="460" x2="760" y2="800" stroke="#fda4af" stroke-width="4" />

        <!-- 중앙의 거대한 구멍 뚫린 에멘탈 치즈 조각 -->
        <g id="cheese" transform="translate(240, 320)">
          <polygon points="0,180 320,180 270,70 50,70" fill="#facc15" stroke="#ca8a04" stroke-width="5" />
          <polygon points="270,70 320,180 370,120 320,30" fill="#eab308" stroke="#ca8a04" stroke-width="5" />
          <polygon points="50,70 270,70 320,30 100,30" fill="#fde047" stroke="#ca8a04" stroke-width="5" />
          <!-- 치즈 구멍들 -->
          <ellipse cx="100" cy="130" rx="24" ry="18" fill="#ca8a04" opacity="0.6" />
          <ellipse cx="200" cy="115" rx="32" ry="22" fill="#ca8a04" opacity="0.6" />
          <ellipse cx="250" cy="145" rx="20" ry="14" fill="#ca8a04" opacity="0.6" />
          <ellipse cx="160" cy="50" rx="18" ry="10" fill="#ca8a04" opacity="0.5" />
        </g>

        <!-- 좌측: 모자 쓴 세련된 서울 쥐 -->
        <g transform="translate(100, 380)">
          <!-- 실크 햇 모자 -->
          <rect x="75" y="0" width="40" height="45" fill="#1e293b" rx="4" />
          <ellipse cx="95" cy="45" rx="35" ry="10" fill="#0f172a" />
          <rect x="75" y="32" width="40" height="8" fill="#ef4444" />
          
          <!-- 귀 -->
          <circle cx="50" cy="55" r="28" fill="#fbcfe8" stroke="#64748b" stroke-width="3.5" />
          <circle cx="135" cy="55" r="28" fill="#fbcfe8" stroke="#64748b" stroke-width="3.5" />
          <!-- 머리 -->
          <circle cx="95" cy="90" r="45" fill="#94a3b8" stroke="#475569" stroke-width="4" />
          <circle cx="80" cy="85" r="6" fill="#0f172a" />
          <circle cx="110" cy="85" r="6" fill="#0f172a" />
          <polygon points="95,95 88,105 102,105" fill="#f43f5e" />
          <!-- 몸 -->
          <ellipse cx="95" cy="175" rx="50" ry="55" fill="#94a3b8" stroke="#475569" stroke-width="4" />
          <!-- 빨간 나비넥타이 -->
          <polygon points="75,130 95,140 75,150" fill="#ef4444" />
          <polygon points="115,130 95,140 115,150" fill="#ef4444" />
          <circle cx="95" cy="140" r="5" fill="#b91c1c" />
        </g>

        <!-- 우측: 짚모자와 멜빵을 입은 순박한 시골 쥐 -->
        <g transform="translate(560, 380)">
          <!-- 귀 -->
          <circle cx="45" cy="55" r="28" fill="#fed7aa" stroke="#78350f" stroke-width="3.5" />
          <circle cx="135" cy="55" r="28" fill="#fed7aa" stroke="#78350f" stroke-width="3.5" />
          <!-- 밀짚모자 -->
          <ellipse cx="90" cy="40" rx="60" ry="18" fill="#fde047" stroke="#ca8a04" stroke-width="3" />
          <circle cx="90" cy="30" r="30" fill="#facc15" stroke="#ca8a04" stroke-width="3" />
          
          <!-- 머리 -->
          <circle cx="90" cy="90" r="45" fill="#d97706" stroke="#92400e" stroke-width="4" />
          <circle cx="75" cy="85" r="6" fill="#0f172a" />
          <circle cx="105" cy="85" r="6" fill="#0f172a" />
          <polygon points="90,95 83,105 97,105" fill="#f43f5e" />
          <!-- 몸 (청색 멜빵바지) -->
          <ellipse cx="90" cy="175" rx="50" ry="55" fill="#d97706" stroke="#92400e" stroke-width="4" />
          <path d="M50,150 L130,150 L130,225 L50,225 Z" fill="#0284c7" stroke="#0369a1" stroke-width="3" />
          <line x1="65" y1="135" x2="70" y2="155" stroke="#0284c7" stroke-width="8" stroke-linecap="round" />
          <line x1="115" y1="135" x2="110" y2="155" stroke="#0284c7" stroke-width="8" stroke-linecap="round" />
        </g>
      </svg>
    `)
  }
];

