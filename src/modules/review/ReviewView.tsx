"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useT } from "@/modules/i18n";
import { addDays, formatDateShort, startOfWeekMonday } from "@/lib/time";
import { Button } from "@/design-system/Button";
import { Card, Skeleton } from "@/design-system/data-display";
import { fetchSessionsSince } from "./api";
import { buildWeeklyReport } from "./insights";
import { WeeklyChart } from "./WeeklyChart";
import { StreakStrip } from "./StreakStrip";

export function ReviewView() {
  const { t, locale } = useT();
  const [weekOffset, setWeekOffset] = useState(0); // 0 = tuần hiện tại

  const weekStart = useMemo(
    () => startOfWeekMonday(addDays(new Date(), -7 * weekOffset)),
    [weekOffset],
  );
  const queryFrom = useMemo(() => addDays(weekStart, -28), [weekStart]);

  const sessions = useQuery({
    queryKey: ["sessions", "review", weekStart.toISOString()],
    queryFn: () => fetchSessionsSince(queryFrom),
  });

  const report = useMemo(
    () => buildWeeklyReport(sessions.data ?? [], weekStart),
    [sessions.data, weekStart],
  );

  const dayLabels = [
    t.review.day_mon,
    t.review.day_tue,
    t.review.day_wed,
    t.review.day_thu,
    t.review.day_fri,
    t.review.day_sat,
    t.review.day_sun,
  ];
  const todayIndex =
    weekOffset === 0
      ? Math.min(6, Math.max(0, Math.floor((Date.now() - weekStart.getTime()) / 86_400_000)))
      : -1;

  const weekLabel =
    weekOffset === 0
      ? t.review.this_week
      : `${formatDateShort(weekStart, locale)} - ${formatDateShort(addDays(weekStart, 6), locale)}`;

  const summaryStats = [
    { label: t.review.total_minutes, value: Math.round(report.totalMinutes), suffix: t.common.minutes_unit },
    { label: t.review.total_sessions, value: report.totalSessions, suffix: undefined },
    { label: t.review.avg_day, value: Math.round(report.totalMinutes / 7), suffix: t.common.minutes_unit },
  ];

  return (
    <div className="grid gap-6">
      <header className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink">{t.review.title}</h1>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset((o) => o + 1)} aria-label={t.review.prev_week}>
            <CaretLeft size={16} />
          </Button>
          <span className="min-w-28 text-center text-sm font-medium">{weekLabel}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
            disabled={weekOffset === 0}
            aria-label={t.review.next_week}
          >
            <CaretRight size={16} />
          </Button>
        </div>
      </header>

      {sessions.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : sessions.isError ? (
        <Card>
          <p className="text-sm text-muted">{t.common.error}</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => sessions.refetch()}>
            {t.common.retry}
          </Button>
        </Card>
      ) : (
        <>
          {/* Mot khoi chi so duy nhat, chia bang divider hairline thay vi 3 card roi */}
          <section className="grid grid-cols-3 divide-x divide-line/60 rounded-lg border border-line bg-surface">
            {summaryStats.map((s) => (
              <div key={s.label} className="px-4 py-3 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{s.label}</p>
                <div className="tnum mt-1 flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-semibold tracking-tight text-ink">{s.value}</span>
                  {s.suffix ? <span className="text-xs font-normal text-muted">{s.suffix}</span> : null}
                </div>
              </div>
            ))}
          </section>

          <Card className="grid gap-2">
            <p className="text-sm font-semibold">{t.review.chart_label}</p>
            <WeeklyChart
              perDay={report.perDay}
              dayLabels={dayLabels}
              todayIndex={todayIndex}
              unitLabel={t.common.minutes_unit}
              ariaLabel={t.review.chart_label}
            />
            {report.totalSessions === 0 ? (
              <p className="text-sm text-muted">{t.review.empty_week}</p>
            ) : null}
          </Card>

          <StreakStrip
            perDay={report.perDay}
            dayLabels={dayLabels}
            todayIndex={todayIndex}
            unitLabel={t.common.minutes_unit}
          />
        </>
      )}
    </div>
  );
}
