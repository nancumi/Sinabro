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

  // 광고가 등록되어 있지 않은 경우, 일반 사용자에게는 숨기고 관리자에게만 플레이스홀더 표시
  if (!isConfigured && !isAdmin) return null;

  const getContainerStyle = () => {
    switch (type) {
      case 'top':
        return 'w-full h-14 md:h-16';
      case 'side':
        return 'w-full h-72 md:h-96';
      case 'bottom':
        return 'w-full h-20 md:h-24';
    }
  };

  return (
    <div
      className={`rounded-lg border border-dashed border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center text-center p-2 overflow-hidden ${getContainerStyle()} ${className}`}
    >
      {isConfigured ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adConfig.adsenseClientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-500 gap-1 select-none">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <Megaphone className="w-3.5 h-3.5 text-slate-500" />
            <span>Google AdSense 광고 영역 ({type === 'top' ? '상단' : type === 'side' ? '우측' : '하단'})</span>
          </div>
          <span className="text-[11px] text-slate-500">
            관리자 설정에서 애드센스 클라이언트 ID와 슬롯 ID를 연결하면 활성화됩니다
          </span>
        </div>
      )}
    </div>
  );
};
