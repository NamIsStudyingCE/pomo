import { requireSupabase } from "@/lib/supabase-browser";
import {
  isGuestMode,
  getGuestTasks,
  createGuestTask,
  updateGuestTask,
  deleteGuestTask,
  saveGuestTasks,
} from "@/modules/auth/guest-storage";
import type { Priority, Task } from "./types";

export async function fetchOpenTasks(): Promise<Task[]> {
  if (isGuestMode()) {
    const tasks = getGuestTasks();
    return tasks
      .filter((t) => t.completed_at === null)
      .sort((a, b) => a.position - b.position);
  }
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
  if (isGuestMode()) {
    const tasks = getGuestTasks();
    return tasks
      .filter((t) => t.completed_at !== null)
      .sort((a, b) => (new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()))
      .slice(0, 50);
  }
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
  if (isGuestMode()) {
    return createGuestTask(input);
  }
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
  if (isGuestMode()) {
    updateGuestTask(id, patch);
    return;
  }
  const sb = requireSupabase();
  const { error } = await sb.from("tasks").update(patch).eq("id", id);
  if (error) throw error;
}

export async function setTaskCompleted(id: string, done: boolean): Promise<void> {
  if (isGuestMode()) {
    updateGuestTask(id, { completed_at: done ? new Date().toISOString() : null });
    return;
  }
  const sb = requireSupabase();
  const { error } = await sb
    .from("tasks")
    .update({ completed_at: done ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: string): Promise<void> {
  if (isGuestMode()) {
    deleteGuestTask(id);
    return;
  }
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
  if (isGuestMode()) {
    updateGuestTask(id, { position });
    return;
  }
  const sb = requireSupabase();
  const { error } = await sb.from("tasks").update({ position }).eq("id", id);
  if (error) throw error;
}

// Khi khoảng position quá nhỏ (giới hạn double), dàn đều lại toàn bộ
export async function normalizePositions(tasks: Task[]): Promise<void> {
  if (isGuestMode()) {
    const normalized = tasks.map((t, i) => ({ ...t, position: (i + 1) * 1000 }));
    saveGuestTasks(normalized);
    return;
  }
  const sb = requireSupabase();
  await Promise.all(
    tasks.map((t, i) => sb.from("tasks").update({ position: (i + 1) * 1000 }).eq("id", t.id)),
  );
}
