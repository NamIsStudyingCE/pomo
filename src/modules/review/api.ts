import { requireSupabase } from "@/lib/supabase-browser";
import type { FocusSession } from "@/modules/focus/types";

// Lấy sessions từ một mốc về nay (phủ cả tuần đang xem + 28 ngày insight)
export async function fetchSessionsSince(from: Date): Promise<FocusSession[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("focus_sessions")
    .select("*")
    .neq("ended_reason", "in_progress")
    .gte("started_at", from.toISOString())
    .order("started_at", { ascending: true })
    .limit(2000);
  if (error) throw error;
  return (data ?? []) as FocusSession[];
}
