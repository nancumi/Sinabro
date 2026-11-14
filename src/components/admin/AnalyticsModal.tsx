'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { DailyAnalytics, ContentAnalytics } from '@/types';
import {
  fetchDateRangeAnalytics,
  subscribeToDateRangeAnalytics,
  getTodayString,
  formatDateToYMD,
} from '@/utils/analytics';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PresetType = 'today' | 'yesterday' | '7days' | 'thisMonth' | 'lastMonth' | '30days' | '90days' | 'custom';
type SortField = 'rank' | 'title' | 'uv' | 'pv' | 'avgDwell' | 'totalDwell';
type SortDirection = 'asc' | 'desc';

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

// 프리셋 날짜 계산 헬퍼
const getPresetDates = (preset: PresetType): { start: string; end: string } => {
  const now = new Date();
  const todayStr = formatDateToYMD(now);

  switch (preset) {
    case 'today':
      return { start: todayStr, end: todayStr };
    case 'yesterday': {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = formatDateToYMD(y);
      return { start: yStr, end: yStr };
    }
    case '7days': {
      const d7 = new Date();
      d7.setDate(d7.getDate() - 6);
      return { start: formatDateToYMD(d7), end: todayStr };
    }
    case 'thisMonth': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: formatDateToYMD(firstDay), end: todayStr };
    }
    case 'lastMonth': {
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: formatDateToYMD(firstDayLastMonth), end: formatDateToYMD(lastDayLastMonth) };
    }
    case '30days': {
      const d30 = new Date();
      d30.setDate(d30.getDate() - 29);
      return { start: formatDateToYMD(d30), end: todayStr };
    }
    case '90days': {
      const d90 = new Date();
      d90.setDate(d90.getDate() - 89);
      return { start: formatDateToYMD(d90), end: todayStr };
    }
    default:
      return { start: todayStr, end: todayStr };
  }
};

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [activePreset, setActivePreset] = useState<PresetType>('today');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<DailyAnalytics | null>(null);
  const [allContents, setAllContents] = useState<ContentAnalytics[]>([]);
  const [rawDailyList, setRawDailyList] = useState<DailyAnalytics[]>([]);
  const [chartViewMode, setChartViewMode] = useState<'daily' | 'hourly'>('hourly');

  // 표 정렬 및 페이지네이션 상태
  const [sortField, setSortField] = useState<SortField>('pv');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 5;

  // 클라이언트 마운트 시 날짜 초기화 (Next.js SSG 프리렌더링 안정성 확보)
  useEffect(() => {
    const today = getTodayString();
    setStartDate(today);
    setEndDate(today);
  }, []);

  // 복수일자 종합 합산 처리 헬퍼 함수
  const processAnalyticsList = (list: DailyAnalytics[], start: string, end: string) => {
    setRawDailyList(list);
    if (list.length === 0) {
      setAnalyticsData(null);
      setAllContents([]);
      return;
    }

    // 복수일자 종합 합산
    const combined: DailyAnalytics = {
      date: start === end ? start : `${start} ~ ${end}`,
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
          if (!c || !c.id) return;
          const safeTitle = c.title || mergedContents[c.id]?.title || c.id || '알 수 없음';
          if (!mergedContents[c.id]) {
            mergedContents[c.id] = {
              id: c.id,
              title: safeTitle,
              pv: c.pv || 0,
              uv: c.uv || 0,
              totalDwellSeconds: c.totalDwellSeconds || 0,
            };
          } else {
            if (c.title) {
              mergedContents[c.id].title = c.title;
            }
            mergedContents[c.id].pv += c.pv || 0;
            mergedContents[c.id].uv += c.uv || 0;
            mergedContents[c.id].totalDwellSeconds += c.totalDwellSeconds || 0;
          }
        });
      }
    });

    combined.contents = mergedContents;
    setAnalyticsData(combined);
    setAllContents(Object.values(mergedContents));
  };

  // 프리셋 버튼 클릭 핸들러
  const handleSelectPreset = (preset: PresetType) => {
    setActivePreset(preset);
    const { start, end } = getPresetDates(preset);
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);

    if (preset === 'today' || preset === 'yesterday') {
      setChartViewMode('hourly');
    } else {
      setChartViewMode('daily');
    }
  };

  // 실시간 구독 (모달이 열려 있는 동안 파이어스토어 onSnapshot 실시간 동기화)
  useEffect(() => {
    if (!isOpen) return;

    const today = getTodayString();
    const start = startDate || today;
    const end = endDate || today;
    if (!start || !end) return;

    setIsLoading(true);

    const unsubscribe = subscribeToDateRangeAnalytics(start, end, (list) => {
      processAnalyticsList(list, start, end);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, startDate, endDate]);

  // 수동 새로고침 핸들러
  const handleManualRefresh = async () => {
    if (!startDate || !endDate) return;
    setIsLoading(true);
    setCurrentPage(1);
    try {
      const list = await fetchDateRangeAnalytics(startDate, endDate);
      processAnalyticsList(list, startDate, endDate);
    } finally {
      setIsLoading(false);
    }
  };

  // 표 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // 정렬된 콘텐츠 목록 계산
  const sortedContents = useMemo(() => {
    const list = [...allContents];
    list.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      switch (sortField) {
        case 'title':
          valA = a.title || a.id || '';
          valB = b.title || b.id || '';
          return sortDirection === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        case 'uv':
          valA = a.uv || 0;
          valB = b.uv || 0;
          break;
        case 'avgDwell':
          valA = a.pv > 0 ? (a.totalDwellSeconds || 0) / a.pv : 0;
          valB = b.pv > 0 ? (b.totalDwellSeconds || 0) / b.pv : 0;
          break;
        case 'totalDwell':
          valA = a.totalDwellSeconds || 0;
          valB = b.totalDwellSeconds || 0;
          break;
        case 'pv':
        default:
          valA = a.pv || 0;
          valB = b.pv || 0;
          break;
      }

      return sortDirection === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    });
    return list;
  }, [allContents, sortField, sortDirection]);

  // 페이지네이션 슬라이스
  const totalPages = Math.max(1, Math.ceil(sortedContents.length / PAGE_SIZE));
  const paginatedContents = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return sortedContents.slice(startIdx, startIdx + PAGE_SIZE);
  }, [sortedContents, currentPage]);

  if (!isOpen) return null;

  const totalPv = analyticsData?.totalPv || 0;
  const totalUv = analyticsData?.totalUv || 0;
  const pvPerUv = totalUv > 0 ? (totalPv / totalUv).toFixed(1) : '0';

  // 총 체류 시간 및 평균 체류 시간 계산
  const totalDwellAll = allContents.reduce((acc, c) => acc + (c.totalDwellSeconds || 0), 0);
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

  // 날짜별 방문 트렌드 데이터 생성 (연속된 일자 목록 + 일별 PV/UV 매핑)
  const dailyTrendData = useMemo(() => {
    if (!startDate || !endDate) return [];

    const [sY, sM, sD] = startDate.split('-').map(Number);
    const [eY, eM, eD] = endDate.split('-').map(Number);
    if (!sY || !sM || !sD || !eY || !eM || !eD) return [];

    const map = new Map<string, DailyAnalytics>();
    rawDailyList.forEach((item) => {
      if (item.date) {
        map.set(item.date, item);
      }
    });

    const start = new Date(sY, sM - 1, sD);
    const end = new Date(eY, eM - 1, eD);
    const result = [];
    const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

    const cur = new Date(start);
    let count = 0;
    while (cur <= end && count <= 180) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      const ymd = `${y}-${m}-${d}`;
      const found = map.get(ymd);

      result.push({
        fullDate: ymd,
        displayDate: `${m}.${d}`,
        dayOfWeek: DAY_NAMES[cur.getDay()],
        pv: found?.totalPv || 0,
        uv: found?.totalUv || 0,
      });

      cur.setDate(cur.getDate() + 1);
      count++;
    }

    return result;
  }, [rawDailyList, startDate, endDate]);

  // 날짜별 최대 PV (차트 높이 기준)
  const maxDailyPv = useMemo(() => {
    return Math.max(...dailyTrendData.map((d) => d.pv), 1);
  }, [dailyTrendData]);

  // 정렬 아이콘 렌더러
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-60 ml-1 inline-block" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-purple-400 ml-1 inline-block" />
    ) : (
      <ArrowDown className="w-3 h-3 text-purple-400 ml-1 inline-block" />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[50px] pb-10 px-3 sm:px-6 bg-black/80 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 mb-10">
        {/* 1. 모달 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  방문자 접속 통계 & 종합 분석
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>실시간 동기화</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                일 단위 전체 접속자 수, 페이지별 순수/중복 방문 및 체류 시간을 실시간 자동 집계합니다.
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

        {/* 2. 날짜 필터 툴바 (단일 행 가로 확장 + 시작일/종료일 선택) */}
        <div className="flex items-center justify-between gap-3 p-3 sm:px-5 bg-slate-950/90 border-b border-slate-800/80 text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
          {/* 7가지 프리셋 버튼 (텍스트만 깔끔하게 단일 행 유지) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleSelectPreset('today')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePreset === 'today'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              오늘
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('yesterday')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePreset === 'yesterday'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              어제
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('7days')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePreset === '7days'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              최근 7일
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('thisMonth')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePreset === 'thisMonth'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              이번 달
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('lastMonth')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePreset === 'lastMonth'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              지난 달
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('30days')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePreset === '30days'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              최근 30일
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('90days')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activePreset === '90days'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              최근 90일
            </button>
          </div>

          {/* 시작일 ~ 종료일 선택 및 조회 버튼 */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-lg px-2.5 py-1 border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset('custom');
                }}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              />
              <span className="text-slate-500">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset('custom');
                }}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>조회</span>
            </button>
          </div>
        </div>

        {/* 3. 모달 본문 */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* A. 핵심 지표 요약 4대 카드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
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

          {/* B. 페이지(콘텐츠)별 인기 순위 및 머문 시간 상세 (5위 페이징 + 좌우 정렬 메달 + 필드 정렬) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  페이지(콘텐츠)별 인기 순위 및 머문 시간
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                총 {allContents.length}개 콘텐츠 (페이지당 5개 표시)
              </span>
            </div>

            {allContents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 border border-slate-800/80 rounded-xl">
                선택한 기간({startDate} ~ {endDate})에 기록된 콘텐츠 접속 데이터가 없습니다.
              </div>
            ) : (
              <div className="border border-slate-800 rounded-xl bg-slate-950/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold select-none">
                      <tr>
                        <th className="py-3 px-4 w-20 text-center whitespace-nowrap">순위</th>
                        <th
                          onClick={() => handleSort('title')}
                          className="py-3 px-4 cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                        >
                          콘텐츠(게임) 이름 {renderSortIcon('title')}
                        </th>
                        <th
                          onClick={() => handleSort('uv')}
                          className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                        >
                          순수 접속 (UV) {renderSortIcon('uv')}
                        </th>
                        <th
                          onClick={() => handleSort('pv')}
                          className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                        >
                          중복 방문 (PV) {renderSortIcon('pv')}
                        </th>
                        <th
                          onClick={() => handleSort('avgDwell')}
                          className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                        >
                          평균 머문 시간 {renderSortIcon('avgDwell')}
                        </th>
                        <th
                          onClick={() => handleSort('totalDwell')}
                          className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                        >
                          총 체류 시간 {renderSortIcon('totalDwell')}
                        </th>
                        <th className="py-3 px-4 w-32 text-center whitespace-nowrap">인기 비중</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {paginatedContents.map((content, idx) => {
                        const actualRank = (currentPage - 1) * PAGE_SIZE + idx + 1;
                        const maxPv = sortedContents[0]?.pv || 1;
                        const ratioPct = Math.round(((content.pv || 0) / maxPv) * 100);
                        const avgTime =
                          content.pv > 0
                            ? Math.round((content.totalDwellSeconds || 0) / content.pv)
                            : 0;

                        // 메달과 등수를 가로(좌우)로 나란히 표시
                        let medalBadge = (
                          <span className="inline-flex items-center gap-1 justify-center font-bold text-slate-400">
                            {actualRank}위
                          </span>
                        );
                        if (actualRank === 1) {
                          medalBadge = (
                            <span className="inline-flex items-center gap-1.5 justify-center font-black text-yellow-400">
                              <span>🥇</span>
                              <span>1위</span>
                            </span>
                          );
                        } else if (actualRank === 2) {
                          medalBadge = (
                            <span className="inline-flex items-center gap-1.5 justify-center font-black text-slate-300">
                              <span>🥈</span>
                              <span>2위</span>
                            </span>
                          );
                        } else if (actualRank === 3) {
                          medalBadge = (
                            <span className="inline-flex items-center gap-1.5 justify-center font-black text-amber-600">
                              <span>🥉</span>
                              <span>3위</span>
                            </span>
                          );
                        }

                        return (
                          <tr
                            key={content.id}
                            className="hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 px-4 text-center whitespace-nowrap">{medalBadge}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-200">
                                  {content.title || content.id || '알 수 없음'}
                                </span>
                                {(content.id === 'job_portal' || (typeof content.title === 'string' && content.title.includes('job.ws.ai.kr'))) && (
                                  <a
                                    href="https://job.ws.ai.kr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-500/25 transition-colors cursor-pointer"
                                    title="job.ws.ai.kr 사이트 새 창 열기"
                                  >
                                    <span>바로가기</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-cyan-400 whitespace-nowrap">
                              {(content.uv || 0).toLocaleString()}명
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-purple-300 whitespace-nowrap">
                              {(content.pv || 0).toLocaleString()}회
                            </td>
                            <td className="py-3 px-4 text-right text-amber-300 whitespace-nowrap">
                              {formatSeconds(avgTime)}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-400 whitespace-nowrap">
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

                {/* 5위 이상 페이지네이션 컨트롤 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-950/70 text-xs">
                    <span className="text-slate-400">
                      총 {allContents.length}개 중 {(currentPage - 1) * PAGE_SIZE + 1} -{' '}
                      {Math.min(currentPage * PAGE_SIZE, allContents.length)}개 표시
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="이전 페이지"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="다음 페이지"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* C. 날짜별/시간대별 유입 차트 (토글) & 여유 있는 디바이스 접속 분포 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* 1. 날짜별 / 시간대별 접속 분포 차트 (7컬럼, 토글 지원) */}
            <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  {chartViewMode === 'daily' ? (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      날짜별 방문 트렌드
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      시간대별 방문 트렌드 (0시 ~ 23시)
                    </>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-[11px] text-slate-500">
                    {chartViewMode === 'daily' ? '일자별 추이' : '피크 시간대 분석'}
                  </span>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setChartViewMode('daily')}
                      className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        chartViewMode === 'daily'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      날짜별
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartViewMode('hourly')}
                      className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        chartViewMode === 'hourly'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      시간대별
                    </button>
                  </div>
                </div>
              </div>

              {chartViewMode === 'daily' ? (
                <div className="space-y-3">
                  <div className="h-32 flex items-end gap-1 pt-4 px-1 border-b border-slate-800 justify-center">
                    {dailyTrendData.length === 0 ? (
                      <div className="flex items-center justify-center w-full h-full text-slate-500 text-xs">
                        선택된 기간의 일자별 데이터가 없습니다.
                      </div>
                    ) : (
                      dailyTrendData.map((d) => {
                        const heightPct = d.pv > 0 ? Math.max(8, Math.round((d.pv / maxDailyPv) * 100)) : 4;

                        return (
                          <div
                            key={d.fullDate}
                            className="flex-1 max-w-[36px] flex flex-col items-center group relative h-full justify-end"
                          >
                            {/* 마우스 호버 툴팁 */}
                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none z-20 whitespace-nowrap space-y-0.5">
                              <div className="font-bold text-slate-200 border-b border-slate-800 pb-0.5">
                                {d.fullDate} ({d.dayOfWeek})
                              </div>
                              <div className="text-purple-300 font-medium">
                                조회수(PV): <span className="font-bold">{(d.pv || 0).toLocaleString()}회</span>
                              </div>
                              <div className="text-cyan-300 font-medium">
                                방문자(UV): <span className="font-bold">{(d.uv || 0).toLocaleString()}명</span>
                              </div>
                            </div>

                            {/* 바 상단 수치 (일자 수가 14개 이하일 때 표시) */}
                            {dailyTrendData.length <= 14 && d.pv > 0 && (
                              <span className="text-[9px] font-bold text-purple-300 mb-1 group-hover:scale-110 transition-transform">
                                {d.pv}
                              </span>
                            )}

                            {/* 바 */}
                            <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full rounded-t transition-all ${
                                d.pv > 0
                                  ? 'bg-gradient-to-t from-purple-600 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-400'
                                  : 'bg-slate-800/40'
                              }`}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* X축 날짜 레이블 */}
                  {dailyTrendData.length > 0 && (
                    <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-0.5">
                      {dailyTrendData.length <= 12 ? (
                        dailyTrendData.map((d) => (
                          <span key={d.fullDate} className="text-center flex-1 truncate">
                            {d.displayDate}
                          </span>
                        ))
                      ) : (
                        <>
                          <span>{dailyTrendData[0]?.displayDate}</span>
                          <span>{dailyTrendData[Math.floor(dailyTrendData.length * 0.25)]?.displayDate}</span>
                          <span>{dailyTrendData[Math.floor(dailyTrendData.length * 0.5)]?.displayDate}</span>
                          <span>{dailyTrendData[Math.floor(dailyTrendData.length * 0.75)]?.displayDate}</span>
                          <span>{dailyTrendData[dailyTrendData.length - 1]?.displayDate}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-32 flex items-end gap-1 pt-4 px-1 border-b border-slate-800">
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
              )}
            </div>

            {/* 2. 접속 기기(디바이스) 분포 (5컬럼 - 여유 있고 쾌적한 레이아웃) */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-4">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                기기별 접속 분포
              </span>

              <div className="space-y-4 py-1">
                {/* 모바일 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> 모바일
                    </span>
                    <span className="font-bold text-slate-100">
                      {mobileCount}명 <span className="text-emerald-400 ml-1 font-black">({mobilePct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${mobilePct}%` }}
                    />
                  </div>
                </div>

                {/* PC 데스크탑 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                      <Monitor className="w-3.5 h-3.5 text-cyan-400" /> 데스크탑 (PC)
                    </span>
                    <span className="font-bold text-slate-100">
                      {desktopCount}명 <span className="text-cyan-400 ml-1 font-black">({desktopPct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${desktopPct}%` }}
                    />
                  </div>
                </div>

                {/* 태블릿 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                      <Tablet className="w-3.5 h-3.5 text-purple-400" /> 태블릿
                    </span>
                    <span className="font-bold text-slate-100">
                      {tabletCount}명 <span className="text-purple-400 ml-1 font-black">({tabletPct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${tabletPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. 모달 푸터 */}
        <div className="flex items-center justify-end p-4 border-t border-slate-800 bg-slate-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
