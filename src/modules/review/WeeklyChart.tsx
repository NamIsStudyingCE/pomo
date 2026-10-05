"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function WeeklyChart({
  perDay,
  dayLabels,
  todayIndex,
  unitLabel,
  ariaLabel,
}: {
  perDay: number[];
  dayLabels: string[];
  todayIndex: number; // -1 khi đang xem tuần khác
  unitLabel: string;
  ariaLabel: string;
}) {
  const data = perDay.map((m, i) => ({ day: dayLabels[i], minutes: Math.round(m) }));

  return (
    <div className="h-56 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            dy={6}
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "var(--color-accent-soft)", opacity: 0.35 }}
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              borderRadius: 12,
              fontSize: 13,
            }}
            labelStyle={{ color: "var(--color-muted)" }}
            formatter={(value) => [`${value} ${unitLabel}`]}
          />
          <Bar dataKey="minutes" radius={[6, 6, 2, 2]} maxBarSize={36}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill="var(--color-accent)"
                fillOpacity={todayIndex === -1 ? 0.7 : i === todayIndex ? 1 : 0.35}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
