// Pure weekly report + insights (SPEC F7, ARCHITECTURE mục 9). Test: tests/insights.test.ts
import { addDays, daypartOf, startOfDay, type Daypart } from "@/lib/time";
import type { FocusSession } from "@/modules/focus/types";

export interface WeeklyReport {
  weekStart: Date;
  perDay: number[]; // 7 phần tử, phút theo ngày, Thứ 2..CN
  totalMinutes: number;
  totalSessions: number;
  prevTotalMinutes: number;
  bestDayIndex: number; // -1 nếu tuần rỗng
}

function endDay(s: FocusSession): Date {
  return startOfDay(new Date(s.ended_at ?? s.started_at));
}

// Giờ thật để xác định buổi (không dùng endDay vì đó là mốc 00:00)
function endMoment(s: FocusSession): Date {
  return new Date(s.ended_at ?? s.started_at);
}

function minutes(s: FocusSession): number {
  return (s.actual_focus_seconds ?? 0) / 60;
}

export function buildWeeklyReport(sessions: FocusSession[], weekStart: Date): WeeklyReport {
  const perDay = Array.from({ length: 7 }, () => 0);
  let totalSessions = 0;
  let prevTotalMinutes = 0;
  const weekEnd = addDays(weekStart, 7);
  const prevStart = addDays(weekStart, -7);

  for (const s of sessions) {
    if (s.ended_reason === "in_progress") continue;
    const day = endDay(s).getTime();
    if (day >= weekStart.getTime() && day < weekEnd.getTime()) {
      const idx = Math.round((day - weekStart.getTime()) / 86_400_000);
      if (idx >= 0 && idx < 7) {
        perDay[idx] += minutes(s);
        totalSessions += 1;
      }
    } else if (day >= prevStart.getTime() && day < weekStart.getTime()) {
      prevTotalMinutes += minutes(s);
    }
  }

  const totalMinutes = perDay.reduce((a, b) => a + b, 0);
  let bestDayIndex = -1;
  let best = 0;
  perDay.forEach((m, i) => {
    if (m > best) {
      best = m;
      bestDayIndex = i;
    }
  });

  return { weekStart, perDay, totalMinutes, totalSessions, prevTotalMinutes, bestDayIndex };
}

export type InsightsResult =
  | { kind: "insufficient" }
  | { kind: "ok"; daypart: Daypart; trendPct: number | null; bestDayIndex: number };

// Dưới 3 session trong 28 ngày: nói thẳng chưa đủ dữ liệu, không bịa (AC-F7-2)
export function buildInsights(sessions28: FocusSession[], report: WeeklyReport): InsightsResult {
  const finished = sessions28.filter((s) => s.ended_reason !== "in_progress");
  if (finished.length < 3) return { kind: "insufficient" };

  const byDaypart = new Map<Daypart, number>();
  for (const s of finished) {
    const dp = daypartOf(endMoment(s));
    byDaypart.set(dp, (byDaypart.get(dp) ?? 0) + minutes(s));
  }
  let daypart: Daypart = "morning";
  let best = -1;
  for (const [dp, m] of byDaypart) {
    if (m > best) {
      best = m;
      daypart = dp;
    }
  }

  const trendPct =
    report.prevTotalMinutes > 0
      ? Math.round(((report.totalMinutes - report.prevTotalMinutes) / report.prevTotalMinutes) * 100)
      : null;

  return { kind: "ok", daypart, trendPct, bestDayIndex: report.bestDayIndex };
}
