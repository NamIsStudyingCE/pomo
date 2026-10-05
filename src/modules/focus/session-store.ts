"use client";

import { create } from "zustand";
import { computeRemainingSeconds } from "./time-math";

export type SessionStatus = "idle" | "running";

interface SessionStore {
  status: SessionStatus;
  sessionId: string | null;
  taskId: string | null;
  taskTitle: string;
  startedAtMs: number;
  plannedMs: number;
  distractionMs: number;
  hiddenAtMs: number | null;
  remainingSeconds: number;
  // vừa rời tab x giây (để hiện cảnh báo); null = không có cảnh báo
  awayNoticeSeconds: number | null;
  // vừa kết thúc một session (để hiện dialog hoàn thành)
  completedInfo: { actualSeconds: number; plannedMinutes: number; taskId: string | null; reason: "completed" | "stopped_early" } | null;

  start: (s: {
    sessionId: string;
    taskId: string | null;
    taskTitle: string;
    startedAtMs: number;
    plannedMs: number;
    distractionMs: number;
  }) => void;
  tick: (now: number) => void;
  onHidden: (now: number) => void;
  onVisible: (now: number) => void;
  finish: (info: SessionStore["completedInfo"]) => void;
  clearAwayNotice: () => void;
  clearCompletedInfo: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  status: "idle",
  sessionId: null,
  taskId: null,
  taskTitle: "",
  startedAtMs: 0,
  plannedMs: 0,
  distractionMs: 0,
  hiddenAtMs: null,
  remainingSeconds: 0,
  awayNoticeSeconds: null,
  completedInfo: null,

  start: (s) =>
    set({
      status: "running",
      sessionId: s.sessionId,
      taskId: s.taskId,
      taskTitle: s.taskTitle,
      startedAtMs: s.startedAtMs,
      plannedMs: s.plannedMs,
      distractionMs: s.distractionMs,
      hiddenAtMs: null,
      remainingSeconds: computeRemainingSeconds(Date.now(), s.startedAtMs, s.plannedMs, s.distractionMs),
      awayNoticeSeconds: null,
      completedInfo: null,
    }),

  tick: (now) => {
    const s = get();
    if (s.status !== "running") return;
    // Tab đang ẩn: thời gian ẩn chưa chốt vào distractionMs, phải trừ luôn khoảng đang ẩn
    const effectiveDistraction = s.distractionMs + (s.hiddenAtMs ? now - s.hiddenAtMs : 0);
    set({ remainingSeconds: computeRemainingSeconds(now, s.startedAtMs, s.plannedMs, effectiveDistraction) });
  },

  onHidden: (now) => {
    if (get().status !== "running") return;
    set({ hiddenAtMs: now });
  },

  onVisible: (now) => {
    const s = get();
    if (s.status !== "running" || s.hiddenAtMs === null) return;
    const awayMs = now - s.hiddenAtMs;
    set({
      distractionMs: s.distractionMs + awayMs,
      hiddenAtMs: null,
      awayNoticeSeconds: Math.round(awayMs / 1000),
    });
  },

  finish: (info) =>
    set({
      status: "idle",
      sessionId: null,
      taskId: null,
      taskTitle: "",
      startedAtMs: 0,
      plannedMs: 0,
      distractionMs: 0,
      hiddenAtMs: null,
      remainingSeconds: 0,
      awayNoticeSeconds: null,
      completedInfo: info,
    }),

  clearAwayNotice: () => set({ awayNoticeSeconds: null }),
  clearCompletedInfo: () => set({ completedInfo: null }),
}));
