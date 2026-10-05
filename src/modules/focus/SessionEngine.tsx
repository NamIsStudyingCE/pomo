"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/modules/i18n";
import { formatClock } from "@/lib/time";
import { Dialog } from "@/design-system/Dialog";
import { Button } from "@/design-system/Button";
import { useToggleDone } from "@/modules/tasks/hooks";
import { updateDistraction } from "./api";
import { useSessionStore } from "./session-store";
import { computeRemainingSeconds } from "./time-math";
import { useFinalizeSession } from "./useFinalizeSession";

// Trái tim của Focus Mode: tick, theo dõi rời tab, kết thúc session, title tab.
// Mounted 1 lần trong AppShell nên session chạy xuyên suốt mọi trang.
export function SessionEngine() {
  const { t } = useT();
  const router = useRouter();
  const status = useSessionStore((s) => s.status);
  const remainingSeconds = useSessionStore((s) => s.remainingSeconds);
  const taskTitle = useSessionStore((s) => s.taskTitle);
  const awayNoticeSeconds = useSessionStore((s) => s.awayNoticeSeconds);
  const completedInfo = useSessionStore((s) => s.completedInfo);
  const finalize = useFinalizeSession();
  const toggleDone = useToggleDone();

  // Tick 250ms; giá trị luôn suy ra từ timestamps (SPEC D2)
  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => useSessionStore.getState().tick(Date.now()), 250);
    return () => clearInterval(id);
  }, [status]);

  // Page Visibility API: rời tab thì khoảng đó không tính focus (F5)
  useEffect(() => {
    if (status !== "running") return;
    function onVisibility() {
      const now = Date.now();
      const s = useSessionStore.getState();
      if (document.hidden) {
        s.onHidden(now);
        return;
      }
      // Session đã hết giờ trong lúc ẩn: chốt completed luôn, không báo rời tab nữa
      const effectiveDistraction = s.distractionMs + (s.hiddenAtMs ? now - s.hiddenAtMs : 0);
      if (computeRemainingSeconds(now, s.startedAtMs, s.plannedMs, effectiveDistraction) <= 0) {
        void finalize("completed");
        return;
      }
      s.onVisible(now);
      const after = useSessionStore.getState();
      if (after.sessionId) {
        updateDistraction(after.sessionId, Math.round(after.distractionMs / 1000)).catch(() => {});
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [status, finalize]);

  // Hết giờ khi tab đang hiển thị
  useEffect(() => {
    if (status === "running" && remainingSeconds <= 0 && !document.hidden) {
      void finalize("completed");
    }
  }, [status, remainingSeconds, finalize]);

  // Đồng hồ trên tiêu đề tab (F5: nhìn thấy khi lướt tab bar)
  useEffect(() => {
    if (status !== "running") {
      document.title = "Pomo";
      return;
    }
    document.title = `${formatClock(remainingSeconds)} · ${taskTitle} · Pomo`;
    return () => {
      document.title = "Pomo";
    };
  }, [status, remainingSeconds, taskTitle]);

  return (
    <>
      <Dialog
        open={awayNoticeSeconds !== null}
        onClose={() => useSessionStore.getState().clearAwayNotice()}
        title={t.focus.distraction_title}
      >
        <p className="mb-4 text-sm text-muted">
          {t.focus.distraction_body(formatClock(awayNoticeSeconds ?? 0))}
        </p>
        <Button className="w-full" onClick={() => useSessionStore.getState().clearAwayNotice()}>
          {t.focus.continue}
        </Button>
      </Dialog>

      <Dialog
        open={completedInfo !== null}
        onClose={() => useSessionStore.getState().clearCompletedInfo()}
        title={completedInfo?.reason === "completed" ? t.focus.complete_title : t.focus.stop_title}
      >
        <p className="mb-4 text-sm text-muted">
          {completedInfo?.reason === "completed"
            ? t.focus.complete_body(Math.round((completedInfo.actualSeconds ?? 0) / 60))
            : t.focus.complete_body_honest(Math.round((completedInfo?.actualSeconds ?? 0) / 60))}
        </p>
        <div className="flex flex-col gap-2">
          {completedInfo?.taskId ? (
            <Button
              onClick={async () => {
                if (!completedInfo.taskId) return;
                await toggleDone.mutateAsync({ id: completedInfo.taskId, done: true });
                useSessionStore.getState().clearCompletedInfo();
                router.push("/today");
              }}
            >
              {t.focus.mark_task_done}
            </Button>
          ) : null}
          <Button
            variant="secondary"
            onClick={() => {
              useSessionStore.getState().clearCompletedInfo();
              router.push("/today");
            }}
          >
            {t.focus.keep_open}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
