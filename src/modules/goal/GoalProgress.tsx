"use client";

import { useT } from "@/modules/i18n";
import { Card, Progress } from "@/design-system/data-display";
import { cn } from "@/lib/utils";

export function GoalProgress({
  doneMinutes,
  goalMinutes,
}: {
  doneMinutes: number;
  goalMinutes: number;
}) {
  const { t } = useT();
  const ratio = goalMinutes > 0 ? doneMinutes / goalMinutes : 0;
  const reached = ratio >= 1;
  const pct = Math.min(100, Math.max(0, Math.round(ratio * 100)));

  return (
    <Card className="p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold tracking-tight text-ink">{t.goal.title}</span>
        <span className="tnum text-xs font-medium text-muted">
          <span className={cn("font-bold", reached ? "text-accent-strong" : "text-ink")}>
            {doneMinutes}
          </span>
          <span className="mx-0.5 text-muted/60">{t.goal.of}</span>
          <span>{goalMinutes} {t.common.minutes_unit}</span>
          <span className="ml-1.5 text-muted/70">({pct}%)</span>
        </span>
      </div>
      <Progress ratio={ratio} />
    </Card>
  );
}
