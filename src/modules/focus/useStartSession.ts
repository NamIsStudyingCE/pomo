"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/AuthProvider";
import { insertSession } from "./api";
import { useSessionStore } from "./session-store";
import type { Task } from "@/modules/tasks/types";

// Bắt đầu session: ghi row in_progress NGAY (SPEC D3) rồi mới chạy đồng hồ.
export function useStartSession() {
  const { session } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task,
      title,
      minutes,
    }: {
      task?: Task | null;
      title?: string;
      minutes: number;
    }) => {
      if (!session) throw new Error("Chưa đăng nhập");
      return insertSession({
        userId: session.user.id,
        taskId: task?.id ?? null,
        taskTitle: task?.title ?? title ?? "Tập trung tự do",
        plannedMinutes: minutes,
      });
    },
    onSuccess: (row) => {
      useSessionStore.getState().start({
        sessionId: row.id,
        taskId: row.task_id,
        taskTitle: row.task_title,
        startedAtMs: new Date(row.started_at).getTime(),
        plannedMs: row.planned_minutes * 60_000,
        distractionMs: 0,
      });
      qc.invalidateQueries({ queryKey: ["sessions"] });
      router.push("/focus");
    },
  });
}
