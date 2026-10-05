"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useT } from "@/modules/i18n";
import { Dialog } from "@/design-system/Dialog";
import { Button } from "@/design-system/Button";
import { EmptyState, Skeleton } from "@/design-system/data-display";
import { useProfile, useUpdateProfile } from "@/modules/settings/hooks";
import { useOpenTasks } from "@/modules/tasks/hooks";
import { sortForPicker, type Task } from "@/modules/tasks/types";
import { PriorityDot } from "@/modules/tasks/PriorityPicker";
import {
  buildBehavior,
  scoreTasks,
  type ReasonCode,
  type ScoredTask,
} from "@/modules/tasks/scoring";
import { fetchBehaviorSessions } from "./api";
import { useStartSession } from "./useStartSession";
import { cn } from "@/lib/utils";

// Diem cham tu modules/tasks/scoring: goi y viec nen lam ngay trong chinh dialog chon viec
// (gop tu SuggestDialog da xoa: mot duong start duy nhat, khong hai modal chong nhau).
function useSuggestions(): { data: ScoredTask[] | null; isLoading: boolean } {
  const tasks = useOpenTasks();
  const behaviorQuery = useQuery({ queryKey: ["sessions", "behavior28"], queryFn: fetchBehaviorSessions });

  const data = useMemo(() => {
    if (!tasks.data || !behaviorQuery.data) return null;
    return scoreTasks(tasks.data, buildBehavior(behaviorQuery.data));
  }, [tasks.data, behaviorQuery.data]);

  return { data, isLoading: tasks.isLoading || behaviorQuery.isLoading };
}

export function TaskPickerDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useT();
  const tasks = useOpenTasks();
  const { data: suggestions } = useSuggestions();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const start = useStartSession();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [minutes, setMinutes] = useState(25);

  useEffect(() => {
    if (open) {
      setSelectedId(null);
      setTouched(false);
      setMinutes(profile?.preferred_session_minutes ?? 25);
    }
  }, [open, profile]);

  // Chua cham tay: tu dong chon goi y dau (neu co) de giam mot thao tac
  useEffect(() => {
    if (open && !touched && suggestions && suggestions.length > 0) {
      setSelectedId(suggestions[0].task.id);
    }
  }, [open, touched, suggestions]);

  function reasonText(s: ScoredTask): string {
    const r: Record<ReasonCode, string> = {
      overdue: t.suggest.reason_overdue,
      due_today: t.suggest.reason_due_today,
      due_soon: t.suggest.reason_due_soon(s.reasonDays ?? 1),
      daypart: t.suggest.reason_daypart(
        daypartLabel(new Date().getHours()),
      ),
      momentum: t.suggest.reason_momentum,
      completion: t.suggest.reason_completion,
      stale: t.suggest.reason_stale,
      priority_high: t.suggest.reason_priority_high,
      default: t.suggest.reason_default,
    };
    return r[s.reason];
  }

  function daypartLabel(hour: number): string {
    if (hour >= 5 && hour < 11) return t.review.daypart_morning;
    if (hour >= 11 && hour < 17) return t.review.daypart_afternoon;
    if (hour >= 17 && hour < 22) return t.review.daypart_evening;
    return t.review.daypart_night;
  }

  // Mot list duy nhat: viec duoc goi y len truoc (kem ly do), viec con lai giu thu tu cu
  const { list, reasonById } = useMemo(() => {
    const base = sortForPicker(tasks.data ?? []);
    const byId = new Map((suggestions ?? []).map((s) => [s.task.id, s]));
    const rank = new Map((suggestions ?? []).map((s, i) => [s.task.id, i]));
    const ordered = [...base].sort((a, b) => {
      const ra = rank.has(a.id) ? rank.get(a.id)! : Number.MAX_SAFE_INTEGER;
      const rb = rank.has(b.id) ? rank.get(b.id)! : Number.MAX_SAFE_INTEGER;
      return ra - rb;
    });
    return { list: ordered, reasonById: byId };
  }, [tasks.data, suggestions]);

  function pick(id: string) {
    setTouched(true);
    setSelectedId((prev) => (prev === id ? null : id));
  }

  async function onStart() {
    const task = list.find((x) => x.id === selectedId);
    if (!task) return;
    const mins = Math.min(120, Math.max(5, minutes));
    if (profile && profile.preferred_session_minutes !== mins) {
      updateProfile.mutate({ preferred_session_minutes: mins });
    }
    await start.mutateAsync({ task, minutes: mins });
    onClose();
  }

  async function onStartFree() {
    const mins = Math.min(120, Math.max(5, minutes));
    if (profile && profile.preferred_session_minutes !== mins) {
      updateProfile.mutate({ preferred_session_minutes: mins });
    }
    await start.mutateAsync({ title: "Tập trung tự do", minutes: mins });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t.focus.pick_task}
      description={
        <span className="text-xs text-muted font-normal">
          {t.focus.selected_count(selectedId ? 1 : 0)}
        </span>
      }
    >
      {tasks.isLoading ? (
        <div className="grid gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState title={t.focus.pick_empty} />
      ) : (
        <div className="grid gap-4">
          <div className="grid max-h-72 gap-2 overflow-y-auto pr-0.5" role="radiogroup" aria-label={t.focus.pick_task}>
            {list.map((task: Task) => {
              const isSelected = selectedId === task.id;
              const scored = reasonById.get(task.id);
              return (
                <button
                  key={task.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => pick(task.id)}
                  className={cn(
                    "group flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 text-left transition-colors",
                    isSelected
                      ? "border-accent bg-accent-soft/40 opacity-100"
                      : selectedId
                        ? "border-line bg-surface opacity-55 hover:border-accent-strong hover:opacity-100"
                        : "border-line bg-surface opacity-85 hover:border-accent-strong hover:opacity-100",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <PriorityDot priority={task.priority} />
                    <span className="block truncate font-medium">{task.title}</span>
                  </div>

                  {/* Vòng tròn rỗng màu cam nâu đậm, chỉ lấp đầy khi tick chọn */}
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-accent-strong bg-transparent"
                        : "border-accent-strong/80 bg-transparent group-hover:border-accent-strong",
                    )}
                  >
                    {isSelected ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-accent-strong" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <label htmlFor="duration" className="text-sm font-medium">
              {t.focus.duration}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="duration"
                type="number"
                min={5}
                max={120}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="tnum min-h-11 w-20 rounded-lg border border-line bg-surface px-3 text-center"
              />
              <span className="text-sm text-muted">{t.common.minutes_unit}</span>
            </div>
          </div>

          {/* Hai nut dat canh nhau: Nut theo phut chi sang khi chon it nhat 1 viec, nut khong can viec mau secondary khac biet */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              onClick={onStart}
              disabled={!selectedId || start.isPending}
              className={cn(
                "w-full truncate px-2 text-center",
                !selectedId && "opacity-35 cursor-not-allowed hover:brightness-100",
              )}
            >
              {t.focus.start_with(minutes)}
            </Button>
            <Button
              variant="secondary"
              onClick={onStartFree}
              disabled={start.isPending}
              className="w-full truncate px-2 text-center border-line/80 hover:border-ink/30 hover:bg-surface text-ink/80 hover:text-ink"
            >
              {t.focus.start_free}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
