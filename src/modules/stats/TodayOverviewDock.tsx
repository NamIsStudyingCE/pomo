"use client";

import { CheckCircle, Flame } from "@phosphor-icons/react";
import { useT } from "@/modules/i18n";
import { Progress } from "@/design-system/data-display";
import { useTodayStats } from "./StatsRow";

// Mot o chi so trong dock: nhan uppercase nho gon, so lon tracking-tight
function StatCell({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  suffix?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3 text-center">
      <p className="flex items-center justify-center gap-1 text-xs font-medium uppercase tracking-wider text-muted">
        {icon}
        {label}
      </p>
      <div className="tnum mt-1 flex items-baseline justify-center gap-1">
        <span className="text-2xl font-semibold tracking-tight text-ink">{value}</span>
        {suffix ? <span className="text-xs font-normal text-muted">{suffix}</span> : null}
      </div>
    </div>
  );
}

export function TodayOverviewDock({
  doneMinutes,
  goalMinutes,
}: {
  doneMinutes: number;
  goalMinutes: number;
}) {
  const { t } = useT();
  const stats = useTodayStats();
  const safeGoal = Math.max(1, goalMinutes);
  const ratio = doneMinutes / safeGoal;
  const pct = Math.min(100, Math.round(ratio * 100));
  const reached = ratio >= 1;

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      {/* Hang tren dan bang con so: so phut dat duoc la hero number, nhan muc tieu giu tren */}
      <div className="px-4 pb-3 pt-4">
        <div className="mb-1 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-ink">{t.goal.title}</h2>
          {reached ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold text-accent-strong">
              <CheckCircle size={12} weight="fill" />
              {t.goal.reached}
            </span>
          ) : null}
        </div>
        <div className="mb-2 flex items-end justify-between gap-2">
          <p className="tnum flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-ink">{doneMinutes}</span>
            <span className="text-sm font-normal text-muted">
              / {goalMinutes} {t.common.minutes_unit}
            </span>
          </p>
          <span className="tnum pb-1 text-sm font-semibold text-accent-strong">{pct}%</span>
        </div>
        <Progress ratio={ratio} />
      </div>

      {/* Hang duoi: 3 chi so chia bang divider doc 1px, khong dung card roi */}
      <div className="grid grid-cols-3 divide-x divide-line/60 border-t border-line/60 bg-paper/40">
        <StatCell
          label={t.stats.minutes_today}
          value={stats.minutesToday}
          suffix={t.common.minutes_unit}
        />
        <StatCell label={t.stats.sessions_today} value={stats.sessionsCompleted} />
        <StatCell
          label={t.stats.streak}
          value={stats.streak}
          suffix={t.stats.streak_unit}
          icon={
            stats.streak > 0 ? (
              <Flame size={12} weight="fill" className="text-accent-strong" />
            ) : null
          }
        />
      </div>
    </section>
  );
}
