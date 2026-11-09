/**
 * 반응속도에 따른 등급 및 메시지 반환 함수
 */
export function getReactionGrade(ms) {
  if (ms < 150) {
    return {
      title: "신의 반사신경",
      desc: "인간의 한계를 뛰어넘은 불가능에 가까운 반응속도!",
      emoji: "⚡",
      color: "text-amber-400",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };
  }
  if (ms < 200) {
    return {
      title: "광속의 치타",
      desc: "프로게이머 수준의 번개 같은 반응속도!",
      emoji: "🐆",
      color: "text-emerald-400",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    };
  }
  if (ms < 250) {
    return {
      title: "바람을 가르는 매",
      desc: "상위 5% 수준의 날카롭고 빠른 집중력!",
      emoji: "🦅",
      color: "text-cyan-400",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    };
  }
  if (ms < 300) {
    return {
      title: "날렵한 야생마",
      desc: "평균을 훌쩍 뛰어넘는 우수한 반사신경!",
      emoji: "🐎",
      color: "text-blue-400",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    };
  }
  if (ms < 400) {
    return {
      title: "여유로운 산책자",
      desc: "대한민국 성인 기준 지극히 건강한 평균치!",
      emoji: "🚶",
      color: "text-slate-300",
      badgeColor: "bg-slate-700/50 text-slate-300 border-slate-600/40",
    };
  }
  if (ms < 500) {
    return {
      title: "하품하는 거북이",
      desc: "혹시 오늘 피곤하신가요? 기지개를 한번 켜보세요!",
      emoji: "🐢",
      color: "text-amber-300",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };
  }
  return {
    title: "겨울잠 자는 나무늘보",
    desc: "지금 당장 따뜻한 커피 한 잔과 휴식이 필요합니다!",
    emoji: "🦥",
    color: "text-rose-400",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
}

const STORAGE_KEY_BEST = 'sinabro_reflex_best_score';
const STORAGE_KEY_HISTORY = 'sinabro_reflex_history';

export function getBestScore() {
  try {
    const val = localStorage.getItem(STORAGE_KEY_BEST);
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
}

export function saveScore(ms) {
  try {
    const prevBest = getBestScore();
    let isNewBest = false;
    if (!prevBest || ms < prevBest) {
      localStorage.setItem(STORAGE_KEY_BEST, ms.toString());
      isNewBest = true;
    }

    const history = getScoreHistory();
    const newEntry = {
      id: Date.now().toString(),
      score: ms,
      date: new Date().toISOString(),
      grade: getReactionGrade(ms).title,
    };
    const updatedHistory = [newEntry, ...history].slice(0, 100); // 최근 100개 보관
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));

    return {
      isNewBest,
      prevBest,
      bestScore: isNewBest ? ms : prevBest,
    };
  } catch {
    return { isNewBest: false, prevBest: null, bestScore: ms };
  }
}

export function getScoreHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearScoreData() {
  try {
    localStorage.removeItem(STORAGE_KEY_BEST);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (e) {
    console.error(e);
  }
}

