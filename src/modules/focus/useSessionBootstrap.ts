"use client";

import { useEffect } from "react";
import { useAuth } from "@/modules/auth/AuthProvider";
import { fetchInProgressSession, finalizeSession } from "./api";
import { useSessionStore } from "./session-store";

// Chạy một lần sau đăng nhập: khôi phục session còn dang dở (SPEC D3).
// Session đã quá hạn lúc offline: chốt stopped_early, KHÔNG gán completed
// (không chứng minh được người dùng còn tập trung tới cuối).
export function useSessionBootstrap() {
  const { status, session } = useAuth();
  const storeStatus = useSessionStore((s) => s.status);

  useEffect(() => {
    if (status !== "ready" || !session || storeStatus !== "idle") return;
    let cancelled = false;

    fetchInProgressSession()
      .then(async (row) => {
        if (cancelled || !row) return;
        const startedAtMs = new Date(row.started_at).getTime();
        const plannedMs = row.planned_minutes * 60_000;
        const distractionMs = row.distraction_seconds * 1000;
        const now = Date.now();

        if (now - startedAtMs - distractionMs >= plannedMs) {
          await finalizeSession(row.id, {
            ended_at: new Date(startedAtMs + plannedMs + distractionMs).toISOString(),
            actual_focus_seconds: row.planned_minutes * 60,
            distraction_seconds: row.distraction_seconds,
            ended_reason: "stopped_early",
          });
          return;
        }

        useSessionStore.getState().start({
          sessionId: row.id,
          taskId: row.task_id,
          taskTitle: row.task_title,
          startedAtMs,
          plannedMs,
          distractionMs,
        });
      })
      .catch(() => {
        // mất mạng: bỏ qua, lần tải sau thử lại
      });

    return () => {
      cancelled = true;
    };
  }, [status, session, storeStatus]);
}
