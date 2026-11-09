'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  RefreshCw,
  X,
  Award,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { DailyAnalytics, ContentAnalytics } from '@/types';
import { fetchDailyAnalytics, fetchRecentAnalytics, getTodayString } from '@/utils/analytics';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 초 단위를 'X시간 Y분 Z초' 또는 'M분 S초'로 포맷팅
const formatSeconds = (sec: number): string => {
  if (!sec || sec <= 0) return '0초';
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  }
  if (minutes > 0) {
    return `${minutes}분 ${seconds}초`;
  }
  return `${seconds}초`;
};

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [selectedRange, setSelectedRange] = useState<'today' | 'yesterday' | '7days' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>('');
  const [todayStr, setTodayStr] = useState<string>('');
  const [yesterdayStr, setYesterdayStr] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<DailyAnalytics | null>(null);
  const [aggregatedContents, setAggregatedContents] = useState<ContentAnalytics[]>([]);

  // 클라이언트 마운트 시 날짜 초기화 (Next.js SSG 프리렌더링 안정성 확보)
  useEffect(() => {
    const today = getTodayString();
    setCustomDate(today);
    setTodayStr(today);
    setYesterdayStr(getTodayString(-1));
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (selectedRange === 'today') {
        const today = getTodayString();
        const data = await fetchDailyAnalytics(today);
        setAnalyticsData(data);
        extractContents(data);
      } else if (selectedRange === 'yesterday') {
        const yesterday = getTodayString(-1);
        const data = await fetchDailyAnalytics(yesterday);
        setAnalyticsData(data);
        extractContents(data);
      } else if (selectedRange === 'custom') {
        const target = customDate || getTodayString();
        const data = await fetchDailyAnalytics(target);
        setAnalyticsData(data);
        extractContents(data);
      } else if (selectedRange === '7days') {
        const list = await fetchRecentAnalytics(7);
        // 7일치 종합 합산
        const combined: DailyAnalytics = {
          date: `최근 7일 종합 (${getTodayString(-6)} ~ ${getTodayString()})`,
          totalPv: list.reduce((acc, cur) => acc + (cur.totalPv || 0), 0),
          totalUv: list.reduce((acc, cur) => acc + (cur.totalUv || 0), 0),
          deviceStats: {
            mobile: list.reduce((acc, cur) => acc + (cur.deviceStats?.mobile || 0), 0),
            desktop: list.reduce((acc, cur) => acc + (cur.deviceStats?.desktop || 0), 0),
            tablet: list.reduce((acc, cur) => acc + (cur.deviceStats?.tablet || 0), 0),
          },
          hourlyPv: {},
          contents: {},
          updatedAt: Date.now(),
        };

        // 시간대별 합산
        for (let h = 0; h < 24; h++) {
          const hourKey = String(h);
          combined.hourlyPv![hourKey] = list.reduce(
            (acc, cur) => acc + (cur.hourlyPv?.[hourKey] || 0),
            0
          );
        }

        // 콘텐츠별 합산
        const mergedContents: Record<string, ContentAnalytics> = {};
        list.forEach((day) => {
          if (day.contents) {
            Object.values(day.contents).forEach((c) => {
              if (!mergedContents[c.id]) {
                mergedContents[c.id] = {
                  id: c.id,
                  title: c.title,
                  pv: c.pv || 0,
                  uv: c.uv || 0,
                  totalDwellSeconds: c.totalDwellSeconds || 0,
                };
              } else {
                mergedContents[c.id].pv += c.pv || 0;
                mergedContents[c.id].uv += c.uv || 0;
                mergedContents[c.id].totalDwellSeconds += c.totalDwellSeconds || 0;
              }
            });
          }
        });
        combined.contents = mergedContents;
        setAnalyticsData(combined);
        extractContents(combined);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const extractContents = (data: DailyAnalytics | null) => {
    if (!data?.contents) {
      setAggregatedContents([]);
      return;
    }
    const list = Object.values(data.contents);
    // PV 순으로 기본 내림차순 정렬 (인기순)
    list.sort((a, b) => (b.pv || 0) - (a.pv || 0));
    setAggregatedContents(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, selectedRange, customDate]);

  if (!isOpen) return null;

  const totalPv = analyticsData?.totalPv || 0;
  const totalUv = analyticsData?.totalUv || 0;
  const pvPerUv = totalUv > 0 ? (totalPv / totalUv).toFixed(1) : '0';

  // 총 체류 시간 및 평균 체류 시간 계산
  const totalDwellAll = aggregatedContents.reduce((acc, c) => acc + (c.totalDwellSeconds || 0), 0);
  const avgDwellAll = totalPv > 0 ? Math.round(totalDwellAll / totalPv) : 0;

  // 디바이스 비율
  const mobileCount = analyticsData?.deviceStats?.mobile || 0;
  const desktopCount = analyticsData?.deviceStats?.desktop || 0;
  const tabletCount = analyticsData?.deviceStats?.tablet || 0;
  const deviceTotal = mobileCount + desktopCount + tabletCount || 1;
  const mobilePct = Math.round((mobileCount / deviceTotal) * 100);
  const desktopPct = Math.round((desktopCount / deviceTotal) * 100);
  const tabletPct = Math.round((tabletCount / deviceTotal) * 100);

  // 시간대별 최대 PV (차트 높이 기준)
  const maxHourlyPv = Math.max(
    ...Array.from({ length: 24 }).map((_, h) => analyticsData?.hourlyPv?.[String(h)] || 0),
    1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* 1. 모달 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>실시간 방문자 접속 통계 & 종합 분석</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Firebase 실시간
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                일 단위 접속자, 페이지별 순수/중복 방문 및 체류 시간을 종합 정리합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 날짜 필터 바 & 새로고침 */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:px-5 bg-slate-950/80 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedRange('today')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedRange === 'today'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              오늘 {todayStr ? `(${todayStr})` : ''}
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange('yesterday')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedRange === 'yesterday'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              어제 {yesterdayStr ? `(${yesterdayStr})` : ''}
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange('7days')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedRange === '7days'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              최근 7일 종합
            </button>
            <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg px-2 py-1 border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setSelectedRange('custom');
                }}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>

        {/* 3. 모달 스크롤 본문 */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* A. 핵심 지표 요약 4대 카드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. 전체 순수 접속자 수 (UV) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">전체 순수 접속자 (UV)</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-cyan-300">
                {totalUv.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">명</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">고유 기기/사용자 방문</div>
            </div>

            {/* 2. 전체 중복 접속자 수 (PV) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">전체 접속 횟수 (PV)</span>
                <Eye className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-300">
                {totalPv.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">회</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">중복 방문 포함 총 조회수</div>
            </div>

            {/* 3. 방문자당 페이지뷰 (PV/UV) */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">방문자당 페이지뷰</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-300">
                {pvPerUv}
                <span className="text-xs font-normal text-slate-400 ml-1">회 / 명</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">콘텐츠 탐색 활성도</div>
            </div>

            {/* 4. 평균 머문 시간 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">평균 머문 시간</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-amber-300">
                {formatSeconds(avgDwellAll)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                총 {formatSeconds(totalDwellAll)}
              </div>
            </div>
          </div>

          {/* B. 페이지(콘텐츠)별 순수/중복 접속자 및 머문 시간 종합 분석 (인기 순위) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  페이지(콘텐츠)별 인기 순위 및 머문 시간 상세
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                조회수(PV) 많은 순 정렬 • 총 {aggregatedContents.length}개 콘텐츠
              </span>
            </div>

            {aggregatedContents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 border border-slate-800/80 rounded-xl">
                선택한 일자에 기록된 콘텐츠 접속 데이터가 아직 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold">
                    <tr>
                      <th className="py-3 px-4 w-14 text-center">순위</th>
                      <th className="py-3 px-4">콘텐츠(게임) 이름</th>
                      <th className="py-3 px-4 text-right">순수 접속 (UV)</th>
                      <th className="py-3 px-4 text-right">중복 방문 (PV)</th>
                      <th className="py-3 px-4 text-right">평균 머문 시간</th>
                      <th className="py-3 px-4 text-right">총 체류 시간</th>
                      <th className="py-3 px-4 w-28 text-center">인기 비중</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {aggregatedContents.map((content, idx) => {
                      const maxPv = aggregatedContents[0]?.pv || 1;
                      const ratioPct = Math.round(((content.pv || 0) / maxPv) * 100);
                      const avgTime =
                        content.pv > 0
                          ? Math.round((content.totalDwellSeconds || 0) / content.pv)
                          : 0;

                      let medalBadge = <span className="text-slate-400 font-bold">{idx + 1}</span>;
                      if (idx === 0) medalBadge = <span className="text-yellow-400 font-black text-sm">🥇 1</span>;
                      if (idx === 1) medalBadge = <span className="text-slate-300 font-black text-sm">🥈 2</span>;
                      if (idx === 2) medalBadge = <span className="text-amber-600 font-black text-sm">🥉 3</span>;

                      return (
                        <tr
                          key={content.id}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 text-center">{medalBadge}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-200">{content.title}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-cyan-400">
                            {(content.uv || 0).toLocaleString()}명
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-purple-300">
                            {(content.pv || 0).toLocaleString()}회
                          </td>
                          <td className="py-3 px-4 text-right text-amber-300">
                            {formatSeconds(avgTime)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400">
                            {formatSeconds(content.totalDwellSeconds || 0)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${ratioPct}%` }}
                                title={`${ratioPct}%`}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* C. 24시간 시간대별 유입 차트 & 디바이스 비율 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. 시간대별 접속 분포 차트 */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  시간대별 방문 트렌드 (0시 ~ 23시)
                </span>
                <span className="text-[11px] text-slate-500">피크 시간대 분석</span>
              </div>
              <div className="h-28 flex items-end gap-1 pt-4 px-1 border-b border-slate-800">
                {Array.from({ length: 24 }).map((_, h) => {
                  const hourCount = analyticsData?.hourlyPv?.[String(h)] || 0;
                  const heightPct = Math.max(4, Math.round((hourCount / maxHourlyPv) * 100));

                  return (
                    <div
                      key={h}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                    >
                      {/* 마우스 호버 툴팁 */}
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none z-10 whitespace-nowrap">
                        {h}시: {hourCount}회
                      </div>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t transition-all ${
                          hourCount > 0
                            ? 'bg-gradient-to-t from-cyan-600 to-sky-400 group-hover:from-cyan-400 group-hover:to-sky-300'
                            : 'bg-slate-800/40'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 px-1">
                <span>00시</span>
                <span>06시</span>
                <span>12시</span>
                <span>18시</span>
                <span>23시</span>
              </div>
            </div>

            {/* 2. 접속 기기(디바이스) 분포 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                기기별 접속 분포
              </span>

              <div className="space-y-2.5">
                {/* 모바일 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-emerald-400" /> 모바일
                    </span>
                    <span className="font-bold text-slate-200">
                      {mobileCount}명 ({mobilePct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${mobilePct}%` }}
                    />
                  </div>
                </div>

                {/* PC 데스크탑 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Monitor className="w-3 h-3 text-cyan-400" /> 데스크탑 (PC)
                    </span>
                    <span className="font-bold text-slate-200">
                      {desktopCount}명 ({desktopPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${desktopPct}%` }}
                    />
                  </div>
                </div>

                {/* 태블릿 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Tablet className="w-3 h-3 text-purple-400" /> 태블릿
                    </span>
                    <span className="font-bold text-slate-200">
                      {tabletCount}명 ({tabletPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-400 h-full rounded-full"
                      style={{ width: `${tabletPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 text-center">
                전체 {deviceTotal.toLocaleString()}건의 기기 환경 식별
              </div>
            </div>
          </div>
        </div>

        {/* 4. 모달 푸터 */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>데이터는 사용자 브라우저 접속 및 종료 시점에 파이어베이스와 자동 동기화됩니다.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
