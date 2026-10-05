"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecentSessionsForStreak, fetchTodaySessions } from "./api";
import { computeStreak } from "./streak";

// Hook duy nhat con dung: tong hop so lieu hom nay cho dock va trang Today
export function useTodayStats() {
  const today = useQuery({ queryKey: ["sessions", "today"], queryFn: fetchTodaySessions });
  const streakData = useQuery({ queryKey: ["sessions", "streak"], queryFn: fetchRecentSessionsForStreak });

  const sessions = today.data ?? [];
  const finished = sessions.filter((s) => s.ended_reason !== "in_progress");
  const minutesToday = Math.round(
    finished.reduce((sum, s) => sum + (s.actual_focus_seconds ?? 0), 0) / 60,
  );
  const sessionsCompleted = sessions.filter((s) => s.ended_reason === "completed").length;
  const streak = computeStreak(streakData.data ?? []);

  return { isLoading: today.isLoading, isError: today.isError, minutesToday, sessionsCompleted, streak };
}
