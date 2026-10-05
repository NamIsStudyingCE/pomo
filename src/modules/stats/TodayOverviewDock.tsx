"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Flame, PencilSimple } from "@phosphor-icons/react";
import { useT } from "@/modules/i18n";
import { Progress } from "@/design-system/data-display";
import { useUpdateProfile } from "@/modules/settings/hooks";
import { cn } from "@/lib/utils";
import { useTodayStats } from "./StatsRow";

// Mot o chi so trong dock: nhan uppercase nho gon, so lon tracking-tight
function StatCell({
  label,
  value,
  suffix,
  icon,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  suffix?: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="px-4 py-3 text-center">
      <p className="flex items-center justify-center gap-1 text-xs font-medium uppercase tracking-wider text-muted">
        {icon}
        {label}
      </p>
      <div className="tnum mt-1 flex items-baseline justify-center gap-1">
        <span className={cn("text-2xl font-semibold tracking-tight text-ink", valueClassName)}>
          {value}
        </span>
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
  const updateProfile = useUpdateProfile();

  const safeGoal = Math.max(1, goalMinutes);
  const ratio = doneMinutes / safeGoal;
  const pct = Math.min(100, Math.round(ratio * 100));
  const reached = ratio >= 1;

  // Trạng thái hover và tự động mở rộng chu kỳ 8s thu / 5s nở
  const [isHovered, setIsHovered] = useState(false);
  const [autoExpanded, setAutoExpanded] = useState(false);

  // Trạng thái chỉnh sửa trực tiếp mục tiêu
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goalMinutes);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(goalMinutes);
  }, [goalMinutes]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  // Bộ đếm chu kỳ 8s / 5s: Khi hover hoặc đang edit thì tạm dừng chu kỳ
  useEffect(() => {
    if (isHovered || isEditing) {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    if (!autoExpanded) {
      // Đang thu gọn: đợi 8s để nở rộng
      timeoutId = setTimeout(() => {
        setAutoExpanded(true);
      }, 8000);
    } else {
      // Đang nở rộng: giữ 5s rồi thu gọn lại
      timeoutId = setTimeout(() => {
        setAutoExpanded(false);
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [autoExpanded, isHovered, isEditing]);

  const showHint = !isEditing && (isHovered || autoExpanded);

  function handleSaveGoal() {
    const val = Math.min(960, Math.max(15, Math.round(Number(editValue)) || 120));
    setEditValue(val);
    setIsEditing(false);
    if (val !== goalMinutes) {
      updateProfile.mutate({ daily_goal_minutes: val });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveGoal();
    } else if (e.key === "Escape") {
      setEditValue(goalMinutes);
      setIsEditing(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      {/* Hang tren: hero number va khung muc tieu but chi co the bam vao de sua */}
      <div className="px-4 pb-3 pt-4">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">{t.goal.title}</h2>
          <span className="tnum text-sm font-semibold text-accent-strong">{pct}%</span>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {/* So phut da tich luy x */}
          <span
            className={cn(
              "tnum text-3xl font-semibold tracking-tight",
              reached ? "text-accent-strong" : "text-ink",
            )}
          >
            {doneMinutes}
          </span>

          <span className="text-lg font-light text-muted">/</span>

          {/* Khung y phut but chi bo tron, net dut, no rong sau 8s (5s) hoac khi lia chuot */}
          {isEditing ? (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-accent-strong bg-accent-soft/30 px-2 py-1 transition-all">
              <input
                ref={inputRef}
                type="number"
                min={15}
                max={960}
                value={editValue}
                onChange={(e) => setEditValue(Number(e.target.value))}
                onBlur={handleSaveGoal}
                onKeyDown={handleKeyDown}
                className="tnum w-16 rounded border border-accent/40 bg-surface px-1.5 py-0.5 text-center text-sm font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-accent-strong"
              />
              <span className="text-xs text-muted">{t.common.minutes_unit}</span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // Tranh trigger blur truoc khi click
                  handleSaveGoal();
                }}
                className="flex h-5 w-5 items-center justify-center rounded text-accent-strong hover:bg-accent/20 cursor-pointer"
                title={t.common.save}
              >
                <Check size={14} weight="bold" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={cn(
                "group relative inline-flex cursor-pointer items-center overflow-hidden rounded-md border border-dashed border-[#B89F82] dark:border-[#8C7A6B] bg-paper/70 hover:bg-paper hover:border-accent-strong/80 py-1 text-xs text-muted transition-all duration-300 ease-in-out select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
                showHint ? "px-2.5 max-w-[340px]" : "px-2 max-w-[130px]",
              )}
              title={t.goal.edit_hint}
            >
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="tnum font-semibold text-ink">
                  {goalMinutes} {t.common.minutes_unit}
                </span>

                {/* Phần nội dung nở rộng hiển thị dòng nhắc nhở */}
                <div
                  className={cn(
                    "flex items-center gap-1 overflow-hidden transition-all duration-300 ease-in-out",
                    showHint ? "opacity-100 max-w-[240px] ml-1 pl-1.5 border-l border-dashed border-[#B89F82]/60" : "opacity-0 max-w-0 pointer-events-none",
                  )}
                >
                  <PencilSimple size={12} className="text-accent-strong shrink-0" />
                  <span className="text-[11px] font-medium text-accent-strong/90 truncate">
                    {t.goal.edit_hint}
                  </span>
                </div>
              </div>
            </button>
          )}
        </div>

        <Progress ratio={ratio} />
      </div>

      {/* Hang duoi: 3 chi so chia bang divider doc 1px, khong dung card roi */}
      <div className="grid grid-cols-3 divide-x divide-line/60 border-t border-line/60 bg-paper/40">
        <StatCell
          label={t.stats.minutes_today}
          value={stats.minutesToday}
          suffix={t.common.minutes_unit}
          valueClassName={reached ? "text-accent-strong" : undefined}
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
