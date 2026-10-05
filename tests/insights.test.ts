import { describe, expect, it } from "vitest";
import { buildInsights, buildWeeklyReport } from "@/modules/review/insights";
import { addDays, startOfWeekMonday } from "@/lib/time";
import type { FocusSession } from "@/modules/focus/types";

let seq = 0;
function sess(at: Date, minutes = 25, reason: "completed" | "stopped_early" | "in_progress" = "completed"): FocusSession {
  seq += 1;
  return {
    id: `s${seq}`,
    user_id: "u",
    task_id: "t",
    task_title: "x",
    planned_minutes: minutes,
    started_at: at.toISOString(),
    ended_at: reason === "in_progress" ? null : at.toISOString(),
    actual_focus_seconds: reason === "in_progress" ? null : minutes * 60,
    distraction_seconds: 0,
    ended_reason: reason,
    created_at: at.toISOString(),
  };
}

const weekStart = startOfWeekMonday(new Date());

describe("buildWeeklyReport", () => {
  it("gom phút đúng ngày trong tuần", () => {
    const monday = new Date(weekStart);
    monday.setHours(9, 0, 0, 0);
    const report = buildWeeklyReport([sess(monday, 30)], weekStart);
    expect(report.perDay[0]).toBe(30);
    expect(report.totalSessions).toBe(1);
    expect(report.totalMinutes).toBe(30);
    expect(report.bestDayIndex).toBe(0);
  });

  it("tính tuần trước riêng", () => {
    const lastWeek = addDays(weekStart, -3);
    lastWeek.setHours(10, 0, 0, 0);
    const report = buildWeeklyReport([sess(lastWeek, 50)], weekStart);
    expect(report.prevTotalMinutes).toBe(50);
    expect(report.totalMinutes).toBe(0);
  });

  it("bỏ qua in_progress", () => {
    const monday = new Date(weekStart);
    monday.setHours(9, 0, 0, 0);
    const report = buildWeeklyReport([sess(monday, 30, "in_progress")], weekStart);
    expect(report.totalSessions).toBe(0);
  });

  it("tuần rỗng -> bestDayIndex -1", () => {
    expect(buildWeeklyReport([], weekStart).bestDayIndex).toBe(-1);
  });
});

describe("buildInsights", () => {
  it("dưới 3 session -> chưa đủ dữ liệu (AC-F7-2)", () => {
    const report = buildWeeklyReport([], weekStart);
    expect(buildInsights([sess(new Date()), sess(new Date())], report).kind).toBe("insufficient");
  });

  it("đủ dữ liệu -> có daypart chiếm ưu thế", () => {
    const morning = new Date(weekStart);
    morning.setHours(8, 0, 0, 0);
    const evening = new Date(weekStart);
    evening.setHours(20, 0, 0, 0);
    const sessions = [sess(morning, 50), sess(morning, 40), sess(evening, 10)];
    const report = buildWeeklyReport(sessions, weekStart);
    const r = buildInsights(sessions, report);
    expect(r.kind).toBe("ok");
    if (r.kind === "ok") expect(r.daypart).toBe("morning");
  });

  it("trendPct null khi tuần trước = 0", () => {
    const at = new Date(weekStart);
    at.setHours(9, 0, 0, 0);
    const sessions = [sess(at), sess(at), sess(at)];
    const report = buildWeeklyReport(sessions, weekStart);
    const r = buildInsights(sessions, report);
    expect(r.kind).toBe("ok");
    if (r.kind === "ok") expect(r.trendPct).toBeNull();
  });

  it("trendPct dương khi tuần này nhiều hơn tuần trước", () => {
    const prev = addDays(weekStart, -2);
    prev.setHours(9, 0, 0, 0);
    const cur = new Date(weekStart);
    cur.setHours(9, 0, 0, 0);
    const sessions = [sess(prev, 10), sess(cur, 30), sess(cur, 30), sess(cur, 20)];
    const report = buildWeeklyReport(sessions, weekStart);
    const r = buildInsights(sessions, report);
    if (r.kind === "ok") expect(r.trendPct).toBeGreaterThan(0);
  });
});
