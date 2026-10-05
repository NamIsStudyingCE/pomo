// Pure streak logic. Streak = số ngày liên tiếp có >= 1 session completed,
// tính theo ngày local của ended_at (ARCHITECTURE 4.2). Test: tests/streak.test.ts
import { dayKey, startOfDay, addDays } from "@/lib/time";
import type { FocusSession } from "@/modules/focus/types";

export function computeStreak(sessions: FocusSession[], today: Date = new Date()): number {
  const days = new Set<string>();
  for (const s of sessions) {
    if (s.ended_reason !== "completed") continue;
    const end = s.ended_at ?? s.started_at;
    days.add(dayKey(new Date(end)));
  }
  if (days.size === 0) return 0;

  // Ngày mới chưa focus: streak vẫn giữ số ngày tính đến hôm qua (AC-F6-3)
  const todayK = dayKey(today);
  let cursor = startOfDay(today);
  if (!days.has(todayK)) cursor = addDays(cursor, -1);

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
