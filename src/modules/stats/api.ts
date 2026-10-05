import { requireSupabase } from "@/lib/supabase-browser";
import { startOfDay, addDays } from "@/lib/time";
import type { FocusSession } from "@/modules/focus/types";

// Sessions bắt đầu trong ngày local hôm nay
export async function fetchTodaySessions(): Promise<FocusSession[]> {
  const sb = requireSupabase();
  const from = startOfDay(new Date());
  const { data, error } = await sb
    .from("focus_sessions")
    .select("*")
    .gte("started_at", from.toISOString())
    .order("started_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FocusSession[];
}

// Sessions 90 ngày gần nhất để tính streak (đủ dư cho mọi streak thực tế)
export async function fetchRecentSessionsForStreak(): Promise<FocusSession[]> {
  const sb = requireSupabase();
  const from = addDays(startOfDay(new Date()), -90);
  const { data, error } = await sb
    .from("focus_sessions")
    .select("*")
    .eq("ended_reason", "completed")
    .gte("started_at", from.toISOString())
    .order("started_at", { ascending: false })
    .limit(2000);
  if (error) throw error;
  return (data ?? []) as FocusSession[];
}
