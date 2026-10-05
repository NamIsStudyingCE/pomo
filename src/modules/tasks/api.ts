import { requireSupabase } from "@/lib/supabase-browser";
import type { Priority, Task } from "./types";

export async function fetchOpenTasks(): Promise<Task[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("tasks")
    .select("*")
    .is("completed_at", null)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function fetchCompletedTasks(): Promise<Task[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("tasks")
    .select("*")
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as Task[];
}

async function fetchMaxPosition(): Promise<number> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("tasks")
    .select("position")
    .is("completed_at", null)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.position ?? 0;
}

export async function createTask(
  userId: string,
  input: { title: string; priority: Priority; deadline: string | null },
): Promise<Task> {
  const sb = requireSupabase();
  const position = (await fetchMaxPosition()) + 1000;
  const { data, error } = await sb
    .from("tasks")
    .insert({ user_id: userId, title: input.title, priority: input.priority, deadline: input.deadline, position })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(
  id: string,
  patch: Partial<Pick<Task, "title" | "priority" | "deadline">>,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from("tasks").update(patch).eq("id", id);
  if (error) throw error;
}

export async function setTaskCompleted(id: string, done: boolean): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb
    .from("tasks")
    .update({ completed_at: done ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

// Fractional position: kéo thả 1 item chỉ tốn 1 write (SPEC D7)
export function betweenPositions(prev: number | null, next: number | null): number {
  if (prev === null && next === null) return 1000;
  if (prev === null) return (next as number) - 1000;
  if (next === null) return prev + 1000;
  return (prev + next) / 2;
}

export async function updateTaskPosition(id: string, position: number): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from("tasks").update({ position }).eq("id", id);
  if (error) throw error;
}

// Khi khoảng position quá nhỏ (giới hạn double), dàn đều lại toàn bộ
export async function normalizePositions(tasks: Task[]): Promise<void> {
  const sb = requireSupabase();
  await Promise.all(
    tasks.map((t, i) => sb.from("tasks").update({ position: (i + 1) * 1000 }).eq("id", t.id)),
  );
}
