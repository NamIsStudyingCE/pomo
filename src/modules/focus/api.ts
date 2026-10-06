import { requireSupabase } from "@/lib/supabase-browser";
import { addDays, startOfDay } from "@/lib/time";
import {
  isGuestMode,
  insertGuestSession,
  finalizeGuestSession,
  updateGuestDistraction,
  getGuestBehaviorSessions,
  getGuestSessions,
} from "@/modules/auth/guest-storage";
import type { FocusSession } from "./types";

export async function insertSession(input: {
  userId: string;
  taskId: string | null;
  taskTitle: string;
  plannedMinutes: number;
}): Promise<FocusSession> {
  if (isGuestMode()) {
    return insertGuestSession(input);
  }
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("focus_sessions")
    .insert({
      user_id: input.userId,
      task_id: input.taskId,
      task_title: input.taskTitle,
      planned_minutes: input.plannedMinutes,
    })
    .select()
    .single();
  if (error) throw error;
  return data as FocusSession;
}

export async function finalizeSession(
  id: string,
  patch: {
    ended_at: string;
    actual_focus_seconds: number;
    distraction_seconds: number;
    ended_reason: "completed" | "stopped_early";
  },
): Promise<void> {
  if (isGuestMode()) {
    finalizeGuestSession(id, patch);
    return;
  }
  const sb = requireSupabase();
  const { error } = await sb.from("focus_sessions").update(patch).eq("id", id);
  if (error) throw error;
}

export async function updateDistraction(id: string, distractionSeconds: number): Promise<void> {
  if (isGuestMode()) {
    updateGuestDistraction(id, distractionSeconds);
    return;
  }
  const sb = requireSupabase();
  const { error } = await sb
    .from("focus_sessions")
    .update({ distraction_seconds: distractionSeconds })
    .eq("id", id);
  if (error) throw error;
}

// 28 ngày session gần nhất cho lớp học hành vi (task ranking trong TaskPickerDialog)
export async function fetchBehaviorSessions(): Promise<FocusSession[]> {
  if (isGuestMode()) {
    return getGuestBehaviorSessions();
  }
  const sb = requireSupabase();
  const from = addDays(startOfDay(new Date()), -28);
  const { data, error } = await sb
    .from("focus_sessions")
    .select("*")
    .neq("ended_reason", "in_progress")
    .gte("started_at", from.toISOString())
    .order("started_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as FocusSession[];
}

// Recovery: lấy session chưa kết thúc mới nhất (nếu có)
export async function fetchInProgressSession(): Promise<FocusSession | null> {
  if (isGuestMode()) {
    const sessions = getGuestSessions();
    const inProgress = sessions.find((s) => s.ended_reason === "in_progress");
    return inProgress ?? null;
  }
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("focus_sessions")
    .select("*")
    .eq("ended_reason", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as FocusSession) ?? null;
}
