import type { Session } from "@supabase/supabase-js";
import type { Task, Priority } from "@/modules/tasks/types";
import type { FocusSession } from "@/modules/focus/types";
import type { Profile } from "@/modules/settings/api";
import { startOfDay, addDays } from "@/lib/time";

const GUEST_KEY = "pomo_guest_session";
const GUEST_PROFILE_KEY = "pomo_guest_profile";
const GUEST_TASKS_KEY = "pomo_guest_tasks";
const GUEST_SESSIONS_KEY = "pomo_guest_sessions";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_KEY) === "true";
}

export function setGuestMode(active: boolean): void {
  if (typeof window === "undefined") return;
  if (active) {
    localStorage.setItem(GUEST_KEY, "true");
    initGuestDataIfEmpty();
  } else {
    localStorage.removeItem(GUEST_KEY);
  }
}

export function createGuestSession(): Session {
  return {
    access_token: "guest_token",
    refresh_token: "guest_refresh_token",
    expires_in: 315360000,
    expires_at: Math.floor(Date.now() / 1000) + 315360000,
    token_type: "bearer",
    user: {
      id: "guest",
      app_metadata: {},
      user_metadata: { name: "Khách" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: "khach@pomo.local",
    },
  };
}

// Khoi tao du lieu mau neu chua co
function initGuestDataIfEmpty() {
  if (!localStorage.getItem(GUEST_PROFILE_KEY)) {
    const defaultProfile: Profile = {
      id: "guest",
      display_name: "Khách",
      daily_goal_minutes: 120,
      preferred_session_minutes: 25,
      locale: "vi",
      sound_enabled: true,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(defaultProfile));
  }

  if (!localStorage.getItem(GUEST_TASKS_KEY)) {
    const initialTasks: Task[] = [
      {
        id: "guest_task_1",
        user_id: "guest",
        title: "Khám phá Pomo - Deep Work Tracker",
        priority: "high",
        deadline: null,
        position: 1000,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "guest_task_2",
        user_id: "guest",
        title: "Bắt đầu phiên tập trung 25 phút đầu tiên",
        priority: "medium",
        deadline: null,
        position: 2000,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(GUEST_TASKS_KEY, JSON.stringify(initialTasks));
  }

  if (!localStorage.getItem(GUEST_SESSIONS_KEY)) {
    localStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify([]));
  }
}

/* ================== PROFILE ================== */
export function getGuestProfile(): Profile {
  initGuestDataIfEmpty();
  const raw = localStorage.getItem(GUEST_PROFILE_KEY);
  if (!raw) {
    return {
      id: "guest",
      display_name: "Khách",
      daily_goal_minutes: 120,
      preferred_session_minutes: 25,
      locale: "vi",
      sound_enabled: true,
      created_at: new Date().toISOString(),
    };
  }
  return JSON.parse(raw);
}

export function saveGuestProfile(patch: Partial<Profile>): void {
  const current = getGuestProfile();
  const updated = { ...current, ...patch };
  localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(updated));
}

/* ================== TASKS ================== */
export function getGuestTasks(): Task[] {
  initGuestDataIfEmpty();
  const raw = localStorage.getItem(GUEST_TASKS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveGuestTasks(tasks: Task[]): void {
  localStorage.setItem(GUEST_TASKS_KEY, JSON.stringify(tasks));
}

export function createGuestTask(input: { title: string; priority: Priority; deadline: string | null }): Task {
  const tasks = getGuestTasks();
  const maxPos = tasks.reduce((max, t) => Math.max(max, t.position), 0);
  const newTask: Task = {
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: "guest",
    title: input.title,
    priority: input.priority,
    deadline: input.deadline,
    position: maxPos + 1000,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveGuestTasks(tasks);
  return newTask;
}

export function updateGuestTask(id: string, patch: Partial<Task>): void {
  const tasks = getGuestTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...patch, updated_at: new Date().toISOString() };
    saveGuestTasks(tasks);
  }
}

export function deleteGuestTask(id: string): void {
  const tasks = getGuestTasks().filter((t) => t.id !== id);
  saveGuestTasks(tasks);
}

/* ================== SESSIONS ================== */
export function getGuestSessions(): FocusSession[] {
  initGuestDataIfEmpty();
  const raw = localStorage.getItem(GUEST_SESSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveGuestSessions(sessions: FocusSession[]): void {
  localStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(sessions));
}

export function insertGuestSession(input: {
  taskId: string | null;
  taskTitle: string;
  plannedMinutes: number;
}): FocusSession {
  const sessions = getGuestSessions();
  const newSession: FocusSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: "guest",
    task_id: input.taskId,
    task_title: input.taskTitle,
    planned_minutes: input.plannedMinutes,
    started_at: new Date().toISOString(),
    ended_at: null,
    actual_focus_seconds: 0,
    distraction_seconds: 0,
    ended_reason: "in_progress",
    created_at: new Date().toISOString(),
  };
  sessions.unshift(newSession);
  saveGuestSessions(sessions);
  return newSession;
}

export function finalizeGuestSession(
  id: string,
  patch: {
    ended_at: string;
    actual_focus_seconds: number;
    distraction_seconds: number;
    ended_reason: "completed" | "stopped_early";
  },
): void {
  const sessions = getGuestSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...patch };
    saveGuestSessions(sessions);
  }
}

export function updateGuestDistraction(id: string, distractionSeconds: number): void {
  const sessions = getGuestSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index !== -1) {
    sessions[index].distraction_seconds = distractionSeconds;
    saveGuestSessions(sessions);
  }
}

export function getGuestTodaySessions(): FocusSession[] {
  const sessions = getGuestSessions();
  const from = startOfDay(new Date()).toISOString();
  return sessions.filter((s) => s.started_at >= from);
}

export function getGuestStreakSessions(): FocusSession[] {
  const sessions = getGuestSessions();
  const from = addDays(startOfDay(new Date()), -90).toISOString();
  return sessions.filter((s) => s.ended_reason === "completed" && s.started_at >= from);
}

export function getGuestBehaviorSessions(): FocusSession[] {
  const sessions = getGuestSessions();
  const from = addDays(startOfDay(new Date()), -28).toISOString();
  return sessions.filter((s) => s.ended_reason !== "in_progress" && s.started_at >= from);
}

export function getGuestSessionsSince(from: Date): FocusSession[] {
  const sessions = getGuestSessions();
  const fromIso = from.toISOString();
  return sessions
    .filter((s) => s.ended_reason !== "in_progress" && s.started_at >= fromIso)
    .sort((a, b) => (a.started_at > b.started_at ? 1 : -1));
}
