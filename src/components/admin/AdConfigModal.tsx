'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { AdConfig } from '@/types';
import { useAppModal } from '@/context/ModalContext';
import { Check } from 'lucide-react';

interface AdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  adConfig: AdConfig;
  onSave: (config: AdConfig) => void;
}

export const AdConfigModal: React.FC<AdConfigModalProps> = ({
  isOpen,
  onClose,
  adConfig,
  onSave,
}) => {
  const { showAlert } = useAppModal();
  const [formData, setFormData] = useState<AdConfig>(adConfig);

  const handleSave = () => {
    onSave(formData);
    showAlert('광고 설정이 저장되었습니다.');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="구글 애즈 (Google AdSense) 광고 영역 설정" maxWidth="max-w-lg">
      <div className="space-y-4 text-[12px]">
        <p className="text-[12px] text-slate-300 leading-relaxed">
          Google AdSense 클라이언트 ID 및 슬롯 ID를 입력하면 사이트 내 상단, 사이드, 하단 광고 영역에 자동으로 광고 배너가 송출됩니다.
        </p>

        <div className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Google AdSense 클라이언트 ID (ca-pub-xxx)
            </label>
            <input
              type="text"
              value={formData.adsenseClientId}
              onChange={(e) => setFormData({ ...formData, adsenseClientId: e.target.value })}
              placeholder="ca-pub-xxxxxxxxxxxxxxxx"
              className="w-full px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="border-t border-slate-800 pt-2.5 space-y-2">
            <div className="text-[11px] font-semibold text-slate-300">배치 영역별 슬롯 설정</div>

            {/* 상단 배너 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium">상단 배너 광고</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={formData.topBannerEnabled}
                    onChange={(e) => setFormData({ ...formData, topBannerEnabled: e.target.checked })}
                    className="rounded text-sky-600 bg-slate-800 border-slate-700"
                  />
                  노출 활성화
                </label>
              </div>
              <input
                type="text"
                value={formData.topSlotId}
                onChange={(e) => setFormData({ ...formData, topSlotId: e.target.value })}
                placeholder="상단 슬롯 ID (예: 1234567890)"
                disabled={!formData.topBannerEnabled}
                className="w-full px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 disabled:bg-slate-950 disabled:text-slate-600 focus:outline-none"
              />
            </div>

            {/* 사이드바 배너 */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium">우측 사이드 광고 (웹 전용)</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={formData.sideBannerEnabled}
                    onChange={(e) => setFormData({ ...formData, sideBannerEnabled: e.target.checked })}
                    className="rounded text-sky-600 bg-slate-800 border-slate-700"
                  />
                  노출 활성화
                </label>
              </div>
              <input
                type="text"
                value={formData.sideSlotId}
                onChange={(e) => setFormData({ ...formData, sideSlotId: e.target.value })}
                placeholder="사이드 슬롯 ID (예: 1234567891)"
                disabled={!formData.sideBannerEnabled}
                className="w-full px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 disabled:bg-slate-950 disabled:text-slate-600 focus:outline-none"
              />
            </div>

            {/* 하단 배너 */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium">하단 배너 광고</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={formData.bottomBannerEnabled}
                    onChange={(e) => setFormData({ ...formData, bottomBannerEnabled: e.target.checked })}
                    className="rounded text-sky-600 bg-slate-800 border-slate-700"
                  />
                  노출 활성화
                </label>
              </div>
              <input
                type="text"
                value={formData.bottomSlotId}
                onChange={(e) => setFormData({ ...formData, bottomSlotId: e.target.value })}
                placeholder="하단 슬롯 ID (예: 1234567892)"
                disabled={!formData.bottomBannerEnabled}
                className="w-full px-2.5 py-1.5 text-[12px] bg-slate-900 border border-slate-800 rounded-md text-slate-100 placeholder-slate-500 disabled:bg-slate-950 disabled:text-slate-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-700/60 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            설정 저장
          </button>
        </div>
      </div>
    </Modal>
  );
};
