import { describe, expect, it } from "vitest";
import { computeStreak } from "@/modules/stats/streak";
import { addDays, startOfDay } from "@/lib/time";
import type { FocusSession } from "@/modules/focus/types";

let seq = 0;
function sess(daysAgo: number, reason: "completed" | "stopped_early" = "completed"): FocusSession {
  seq += 1;
  const end = addDays(startOfDay(new Date()), -daysAgo);
  end.setHours(12, 0, 0, 0);
  return {
    id: `s${seq}`,
    user_id: "u",
    task_id: null,
    task_title: "t",
    planned_minutes: 25,
    started_at: end.toISOString(),
    ended_at: end.toISOString(),
    actual_focus_seconds: 1500,
    distraction_seconds: 0,
    ended_reason: reason,
    created_at: end.toISOString(),
  };
}

describe("computeStreak", () => {
  it("không có session -> 0", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("1 session hôm nay -> 1", () => {
    expect(computeStreak([sess(0)])).toBe(1);
  });

  it("liên tiếp hôm qua + hôm nay -> 2", () => {
    expect(computeStreak([sess(0), sess(1)])).toBe(2);
  });

  it("đứt chuỗi (bỏ hôm qua) -> chỉ tính hôm nay", () => {
    expect(computeStreak([sess(0), sess(2)])).toBe(1);
  });

  it("hôm nay chưa focus: giữ chuỗi tính đến hôm qua (AC-F6-3)", () => {
    expect(computeStreak([sess(1), sess(2)])).toBe(2);
  });

  it("stopped_early không tính streak (AC-F6-2)", () => {
    expect(computeStreak([sess(0, "stopped_early"), sess(1)])).toBe(1);
  });

  it("chuỗi dài 5 ngày", () => {
    expect(computeStreak([sess(0), sess(1), sess(2), sess(3), sess(4)])).toBe(5);
  });
});
