"use client";

// Hallmark · genre: modern-minimal · family: app-dashboard · theme: locked DESIGN.md · page: today
// Stamp thay cho file CSS: project dùng Tailwind utilities trong TSX, không có stylesheet riêng từng trang.

import { useState, useEffect } from "react";
import { Play } from "@phosphor-icons/react";
import { useT } from "@/modules/i18n";
import { formatDateShort } from "@/lib/time";
import { Button } from "@/design-system/Button";
import { TodayOverviewDock } from "@/modules/stats/TodayOverviewDock";
import { useTodayStats } from "@/modules/stats/StatsRow";
import { TaskComposer } from "@/modules/tasks/TaskComposer";
import { TaskList } from "@/modules/tasks/TaskList";
import { TaskPickerDialog } from "@/modules/focus/TaskPickerDialog";
import { useProfile } from "@/modules/settings/hooks";

export default function TodayPage() {
  const { t, locale } = useT();
  const stats = useTodayStats();
  const { data: profile } = useProfile();
  const [pickerOpen, setPickerOpen] = useState(false);

  // Phim tat: Space mo bo chon viec de bat dau phien tap trung
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isInput) return;

      if (e.code === "Space" && !pickerOpen) {
        e.preventDefault();
        setPickerOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pickerOpen]);

  return (
    <div className="grid gap-6">
      {/* Header: mot thong diep duy nhat, ngay thang can baseline ben phai */}
      <header className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-3">
        <h1 className="text-2xl font-bold tracking-tight text-ink">{t.nav.today}</h1>
        <p className="text-sm font-medium text-muted">{formatDateShort(new Date(), locale)}</p>
      </header>

      {/* Khoi dashboard hop nhat: muc tieu + 3 chi so chia hairline */}
      <TodayOverviewDock
        doneMinutes={stats.minutesToday}
        goalMinutes={profile?.daily_goal_minutes ?? 120}
      />

      {/* Hang hanh dong: mot Primary duy nhat. Goi y da nam trong picker, start nhanh nam tren tung dong task */}
      <div className="flex items-center gap-2">
        <Button onClick={() => setPickerOpen(true)}>
          <Play size={16} weight="fill" />
          <span>{t.focus.start}</span>
        </Button>
      </div>

      {/* Danh sach viec: nhan don, khong split-header; tay cam keo-tha tu noi len duoc */}
      <section className="grid gap-3">
        <h2 className="px-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
          {t.tasks.list_label}
        </h2>
        <TaskComposer />
        <TaskList />
      </section>

      <TaskPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
