// Pure scoring xep hang task de goi y viec nen lam (SPEC F8, ARCHITECTURE muc 8). Test: tests/scoring.test.ts
// 2 lop: luat tinh (priority/deadline/tuoi) + hoc hanh vi nhe tu 28 ngay session.
// (Chuyen tu modules/suggest sang tasks khi gop SuggestDialog vao TaskPickerDialog: day la domain tasks.)
import { daypartOf, startOfDay, type Daypart } from "@/lib/time";
import type { Task } from "@/modules/tasks/types";
import type { FocusSession } from "@/modules/focus/types";

export interface TaskBehavior {
  lastSessionAt: number | null;
  dayparts: Set<Daypart>;
  total: number;
  completed: number;
}

export interface Behavior {
  perTask: Map<string, TaskBehavior>;
  bestDaypart: Daypart | null;
  completedCount: number;
}

export function buildBehavior(sessions: FocusSession[]): Behavior {
  const perTask = new Map<string, TaskBehavior>();
  const daypartMinutes = new Map<Daypart, number>();
  let completedCount = 0;

  for (const s of sessions) {
    if (s.ended_reason === "in_progress") continue;
    if (s.ended_reason === "completed") completedCount += 1;
    if (!s.task_id) continue;

    const at = new Date(s.ended_at ?? s.started_at);
    const dp = daypartOf(at);
    daypartMinutes.set(dp, (daypartMinutes.get(dp) ?? 0) + (s.actual_focus_seconds ?? 0) / 60);

    const cur = perTask.get(s.task_id) ?? {
      lastSessionAt: null,
      dayparts: new Set<Daypart>(),
      total: 0,
      completed: 0,
    };
    cur.dayparts.add(dp);
    cur.total += 1;
    if (s.ended_reason === "completed") cur.completed += 1;
    const ts = at.getTime();
    if (cur.lastSessionAt === null || ts > cur.lastSessionAt) cur.lastSessionAt = ts;
    perTask.set(s.task_id, cur);
  }

  let bestDaypart: Daypart | null = null;
  let bestMinutes = 0;
  for (const [dp, mins] of daypartMinutes) {
    if (mins > bestMinutes) {
      bestMinutes = mins;
      bestDaypart = dp;
    }
  }

  return { perTask, bestDaypart, completedCount };
}

export type ReasonCode =
  | "overdue"
  | "due_today"
  | "due_soon"
  | "daypart"
  | "momentum"
  | "completion"
  | "stale"
  | "priority_high"
  | "default";

// Ly do hien thi: uu tien yeu to thoi gian (khan) roi toi thoi quen (thong minh),
// cuoi cung moi toi priority tinh do chinh nguoi dung tu gan.
const REASON_DISPLAY_ORDER: ReasonCode[] = [
  "overdue",
  "due_today",
  "daypart",
  "momentum",
  "due_soon",
  "completion",
  "priority_high",
  "stale",
  "default",
];

export interface ScoredTask {
  task: Task;
  score: number;
  reason: ReasonCode;
  reasonDays?: number;
}

export function scoreTasks(tasks: Task[], behavior: Behavior, now: Date = new Date()): ScoredTask[] {
  // Trong so lop hoc: duoi 10 session gan nhu thuan luat tinh (AC-F8-1)
  const w = Math.min(1, behavior.completedCount / 20);
  const currentDaypart = daypartOf(now);
  const todayStart = startOfDay(now).getTime();
  const results: ScoredTask[] = [];

  for (const task of tasks) {
    if (task.completed_at) continue;

    const base = task.priority === "high" ? 100 : task.priority === "medium" ? 60 : 30;
    let score = base;
    const contributions: { reason: ReasonCode; value: number; days?: number }[] = [];
    if (task.priority === "high") contributions.push({ reason: "priority_high", value: base });

    if (task.deadline) {
      const diffDays = Math.round(
        (new Date(`${task.deadline}T00:00:00`).getTime() - todayStart) / 86_400_000,
      );
      if (diffDays < 0) {
        score += 80;
        contributions.push({ reason: "overdue", value: 80 });
      } else if (diffDays === 0) {
        score += 50;
        contributions.push({ reason: "due_today", value: 50 });
      } else if (diffDays <= 3) {
        const v = diffDays === 1 ? 30 : 15;
        score += v;
        contributions.push({ reason: "due_soon", value: v, days: diffDays });
      }
    }

    const ageDays = Math.floor(
      (todayStart - startOfDay(new Date(task.created_at)).getTime()) / 86_400_000,
    );
    if (ageDays > 7) {
      score += 10;
      contributions.push({ reason: "stale", value: 10 });
    }

    const b = behavior.perTask.get(task.id);
    if (b && w > 0) {
      if (b.dayparts.has(currentDaypart)) {
        score += 40 * w;
        contributions.push({ reason: "daypart", value: 40 * w });
      } else if (behavior.bestDaypart === currentDaypart) {
        score += 15 * w;
      }
      if (b.lastSessionAt !== null && now.getTime() - b.lastSessionAt < 3 * 86_400_000) {
        score += 20 * w;
        contributions.push({ reason: "momentum", value: 20 * w });
      }
      if (b.total >= 2) {
        const rate = b.completed / b.total;
        if (rate >= 0.7) {
          score += 10 * w;
          contributions.push({ reason: "completion", value: 10 * w });
        } else if (rate <= 0.3 && b.total >= 3) {
          score -= 15 * w;
        }
      }
    }

    contributions.sort(
      (a, z) =>
        REASON_DISPLAY_ORDER.indexOf(a.reason) - REASON_DISPLAY_ORDER.indexOf(z.reason),
    );
    const top = contributions[0];
    results.push({
      task,
      score,
      reason: top?.reason ?? "default",
      reasonDays: top?.days,
    });
  }

  results.sort((a, z) => z.score - a.score || a.task.position - z.task.position);
  return results.slice(0, 3);
}
