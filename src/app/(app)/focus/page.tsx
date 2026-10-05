"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/modules/i18n";
import { Button } from "@/design-system/Button";
import { Dialog } from "@/design-system/Dialog";
import { EmptyState } from "@/design-system/data-display";
import { TimerRing } from "@/modules/focus/TimerRing";
import { useSessionStore } from "@/modules/focus/session-store";
import { useFinalizeSession } from "@/modules/focus/useFinalizeSession";

export default function FocusPage() {
  const { t } = useT();
  const router = useRouter();
  const status = useSessionStore((s) => s.status);
  const remainingSeconds = useSessionStore((s) => s.remainingSeconds);
  const plannedMs = useSessionStore((s) => s.plannedMs);
  const taskTitle = useSessionStore((s) => s.taskTitle);
  const finalize = useFinalizeSession();
  const [confirmStop, setConfirmStop] = useState(false);

  if (status !== "running") {
    return (
      <EmptyState
        className="pt-24"
        title={t.focus.no_active_title}
        action={<Button onClick={() => router.push("/today")}>{t.focus.back_today}</Button>}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 pt-10 md:pt-16">
      <p className="max-w-full truncate px-4 text-lg font-medium text-muted">{taskTitle}</p>
      <TimerRing remainingSeconds={remainingSeconds} totalSeconds={Math.round(plannedMs / 1000)} />
      <Button variant="secondary" onClick={() => setConfirmStop(true)}>
        {t.focus.stop}
      </Button>

      <Dialog open={confirmStop} onClose={() => setConfirmStop(false)} title={t.focus.stop_title}>
        <p className="mb-4 text-sm text-muted">{t.focus.stop_body}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmStop(false)}>
            {t.common.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              setConfirmStop(false);
              await finalize("stopped_early");
              // Ve thang /today nhu luong het gio: dialog completed (global) di theo sang do
              router.push("/today");
            }}
          >
            {t.focus.stop_confirm}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
