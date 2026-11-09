'use client';

import React, { useEffect } from 'react';
import { AdConfig } from '@/types';
import { Megaphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdSlotProps {
  type: 'top' | 'side' | 'bottom';
  adConfig: AdConfig;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ type, adConfig, className = '' }) => {
  const { isAdmin } = useAuth();
  const isEnabled =
    type === 'top'
      ? adConfig.topBannerEnabled
      : type === 'side'
      ? adConfig.sideBannerEnabled
      : adConfig.bottomBannerEnabled;

  const slotId =
    type === 'top'
      ? adConfig.topSlotId
      : type === 'side'
      ? adConfig.sideSlotId
      : adConfig.bottomSlotId;

  useEffect(() => {
    if (adConfig.adsenseClientId && slotId && typeof window !== 'undefined') {
      try {
        const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense error', e);
      }
    }
  }, [adConfig.adsenseClientId, slotId]);

  if (!isEnabled) return null;

  const isConfigured = Boolean(adConfig.adsenseClientId && slotId);

  // 광고 슬롯이 미설정 상태일 때, 일반 사용자에게는 숨기고 관리자에게만 플레이스홀더 표시
  if (!isConfigured && !isAdmin) return null;

  // 1. 슬롯 ID가 등록되어 구글 광고가 송출되는 경우:
  // 인위적인 점선 테두리, 패딩, 고정 높이를 모두 없애고 구글 광고의 실제 세로 높이에 1px의 빈틈도 없이 완벽 밀착
  if (isConfigured) {
    return (
      <div
        className={`w-full flex items-center justify-center overflow-hidden transition-all ${className}`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={adConfig.adsenseClientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // 2. 관리자 설정 대기용 가이드 플레이스홀더 (슬롯 미등록 시에만 위치 확인용 표시)
  const getPlaceholderHeight = () => {
    switch (type) {
      case 'top':
        return 'h-14 md:h-16';
      case 'side':
        return 'h-72 md:h-80';
      case 'bottom':
        return 'h-20 md:h-24';
    }
  };

  return (
    <div
      className={`w-full rounded-xl border border-dashed border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center text-center p-3 select-none overflow-hidden ${getPlaceholderHeight()} ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
        <Megaphone className="w-3.5 h-3.5 text-sky-400" />
        <span>Google AdSense 광고 영역 ({type === 'top' ? '상단' : type === 'side' ? '우측' : '하단'})</span>
      </div>
      <span className="text-[10px] text-slate-500">
        우측 상단 [광고 설정]에서 슬롯 ID를 입력하면 활성화됩니다
      </span>
    </div>
  );
};
