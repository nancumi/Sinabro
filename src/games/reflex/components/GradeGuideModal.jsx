import React from 'react';
import Modal from './Modal';
import { Award } from 'lucide-react';

const GRADES = [
  { range: '< 150 ms', title: '신의 반사신경', emoji: '⚡', desc: '인간의 한계를 뛰어넘은 불가능에 가까운 반응속도', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  { range: '150 ~ 199 ms', title: '광속의 치타', emoji: '🐆', desc: '프로게이머 수준의 번개 같은 반응속도', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
  { range: '200 ~ 249 ms', title: '바람을 가르는 매', emoji: '🦅', desc: '상위 5% 수준의 날카롭고 빠른 집중력', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' },
  { range: '250 ~ 299 ms', title: '날렵한 야생마', emoji: '🐎', desc: '평균을 훌쩍 뛰어넘는 우수한 반사신경', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
  { range: '300 ~ 399 ms', title: '여유로운 산책자', emoji: '🚶', desc: '대한민국 성인 기준 지극히 건강한 평균치', color: 'border-slate-600/30 bg-slate-700/20 text-slate-300' },
  { range: '400 ~ 499 ms', title: '하품하는 거북이', emoji: '🐢', desc: '피곤함이 몰려오는 상태, 잠시 스트레칭 추천', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  { range: '500 ms 이상', title: '겨울잠 자는 나무늘보', emoji: '🦥', desc: '지금 당장 따뜻한 커피 한 잔과 휴식이 필요!', color: 'border-rose-500/30 bg-rose-500/10 text-rose-300' },
];

export default function GradeGuideModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <Award size={16} className="text-blue-400" />
          반응속도 등급표 안내
        </span>
      }
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-blue-200 text-blue-900 hover:bg-blue-300 transition-colors shadow-sm"
        >
          확인
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        {GRADES.map((g, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border flex items-center justify-between text-[12px] ${g.color}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{g.emoji}</span>
              <div>
                <div className="font-bold flex items-center gap-2">
                  <span>{g.title}</span>
                  <span className="text-[11px] font-mono opacity-80">({g.range})</span>
                </div>
                <div className="text-[11px] opacity-75 mt-0.5">{g.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

