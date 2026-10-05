import { describe, expect, it } from "vitest";
import { buildBehavior, scoreTasks, type Behavior, type TaskBehavior } from "@/modules/tasks/scoring";
import { addDays, dayKey, daypartOf } from "@/lib/time";
import type { Task } from "@/modules/tasks/types";
import type { FocusSession } from "@/modules/focus/types";

let seq = 0;
function task(partial: Partial<Task> = {}): Task {
  seq += 1;
  return {
    id: partial.id ?? `t${seq}`,
    user_id: "u",
    title: partial.title ?? `Task ${seq}`,
    priority: partial.priority ?? "medium",
    deadline: partial.deadline ?? null,
    completed_at: partial.completed_at ?? null,
    position: partial.position ?? seq * 1000,
    created_at: partial.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function emptyBehavior(): Behavior {
  return { perTask: new Map(), bestDaypart: null, completedCount: 0 };
}

function behaviorWith(completedCount: number, perTask: Record<string, TaskBehavior>): Behavior {
  return { perTask: new Map(Object.entries(perTask)), bestDaypart: null, completedCount };
}

describe("scoreTasks: luật tĩnh (cold start)", () => {
  it("high đứng trước medium", () => {
    const a = task({ priority: "medium", position: 1000 });
    const b = task({ priority: "high", position: 2000 });
    const r = scoreTasks([a, b], emptyBehavior());
    expect(r[0].task.id).toBe(b.id);
  });

  it("medium quá hạn thắng high thường (80+30 > 100)", () => {
    const yesterday = dayKey(addDays(new Date(), -1));
    const a = task({ priority: "high" });
    const b = task({ priority: "medium", deadline: yesterday });
    const r = scoreTasks([a, b], emptyBehavior());
    expect(r[0].task.id).toBe(b.id);
    expect(r[0].reason).toBe("overdue");
  });

  it("loại task đã hoàn thành (AC-F8-3)", () => {
    const done = task({ priority: "high", completed_at: new Date().toISOString() });
    const open = task({ priority: "low" });
    const r = scoreTasks([done, open], emptyBehavior());
    expect(r.map((x) => x.task.id)).toEqual([open.id]);
  });

  it("trả tối đa 3 gợi ý", () => {
    const many = Array.from({ length: 6 }, () => task({}));
    expect(scoreTasks(many, emptyBehavior())).toHaveLength(3);
  });

  it("hạn hôm nay có lý do due_today", () => {
    const a = task({ priority: "high", deadline: dayKey(new Date()) });
    const r = scoreTasks([a], emptyBehavior());
    expect(r[0].reason).toBe("due_today");
  });
});

describe("scoreTasks: lớp học hành vi", () => {
  it("w = 0 khi chưa có session: không boost gì", () => {
    const a = task({ priority: "medium" });
    const b = task({ priority: "high" });
    const behavior = behaviorWith(0, {
      [a.id]: { lastSessionAt: Date.now(), dayparts: new Set([daypartOf(new Date())]), total: 5, completed: 5 },
    });
    const r = scoreTasks([a, b], behavior);
    expect(r[0].task.id).toBe(b.id);
  });

  it("task đúng khung giờ quen thuộc + momentum thắng high thường khi w = 1", () => {
    const a = task({ priority: "medium", position: 1000 });
    const b = task({ priority: "high", position: 2000 });
    const behavior = behaviorWith(20, {
      [a.id]: {
        lastSessionAt: Date.now() - 86_400_000, // hôm qua
        dayparts: new Set([daypartOf(new Date())]),
        total: 4,
        completed: 3,
      },
    });
    // a: 60 + 40 (daypart) + 20 (momentum) + 10 (completion 0.75) = 130 > 100
    const r = scoreTasks([a, b], behavior);
    expect(r[0].task.id).toBe(a.id);
    expect(r[0].reason).toBe("daypart");
  });

  it("task hay bị bỏ dở bị trừ điểm", () => {
    const a = task({ priority: "medium" });
    const behavior = behaviorWith(20, {
      [a.id]: { lastSessionAt: null, dayparts: new Set(), total: 4, completed: 0 },
    });
    const [r] = scoreTasks([a], behavior);
    expect(r.score).toBeLessThan(60);
  });
});

describe("buildBehavior", () => {
  it("đếm completed và gom daypart theo task", () => {
    const now = new Date();
    const s: FocusSession = {
      id: "s1",
      user_id: "u",
      task_id: "t1",
      task_title: "x",
      planned_minutes: 25,
      started_at: now.toISOString(),
      ended_at: now.toISOString(),
      actual_focus_seconds: 1500,
      distraction_seconds: 0,
      ended_reason: "completed",
      created_at: now.toISOString(),
    };
    const b = buildBehavior([s]);
    expect(b.completedCount).toBe(1);
    expect(b.perTask.get("t1")?.completed).toBe(1);
    expect(b.perTask.get("t1")?.dayparts.has(daypartOf(now))).toBe(true);
    expect(b.bestDaypart).toBe(daypartOf(now));
  });

  it("bỏ qua session in_progress", () => {
    const s: FocusSession = {
      id: "s2",
      user_id: "u",
      task_id: "t1",
      task_title: "x",
      planned_minutes: 25,
      started_at: new Date().toISOString(),
      ended_at: null,
      actual_focus_seconds: null,
      distraction_seconds: 0,
      ended_reason: "in_progress",
      created_at: new Date().toISOString(),
    };
    const b = buildBehavior([s]);
    expect(b.completedCount).toBe(0);
    expect(b.perTask.size).toBe(0); // in_progress bị bỏ qua hoàn toàn
  });
});
