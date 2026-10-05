"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useT } from "@/modules/i18n";
import { EmptyState, Skeleton } from "@/design-system/data-display";
import { Button } from "@/design-system/Button";
import { betweenPositions, normalizePositions } from "./api";
import { useCompletedTasks, useDeleteTask, useOpenTasks, useReorderTask, useToggleDone } from "./hooks";
import { useStartSession } from "@/modules/focus/useStartSession";
import { useProfile } from "@/modules/settings/hooks";
import { TaskItem } from "./TaskItem";
import { TaskDeleteDialog, TaskEditDialog } from "./TaskEditDialog";
import type { Task } from "./types";

export function TaskList() {
  const { t } = useT();
  const open = useOpenTasks();
  const completed = useCompletedTasks();
  const toggle = useToggleDone();
  const remove = useDeleteTask();
  const reorder = useReorderTask();
  const start = useStartSession();
  const { data: profile } = useProfile();

  // Start 1-click tu dong task: chay ngay voi so phut mac dinh, khong qua dialog chon
  function onQuickStart(task: Task) {
    if (start.isPending) return;
    start.mutate({ task, minutes: profile?.preferred_session_minutes ?? 25 });
  }

  // Bản sao local để kéo thả mượt; đồng bộ lại từ server khi query thay đổi
  const [ordered, setOrdered] = useState<Task[]>([]);
  useEffect(() => {
    if (open.data) setOrdered(open.data);
  }, [open.data]);

  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [showDone, setShowDone] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // KeyboardSensor + sortableKeyboardCoordinates = reorder hoàn toàn bằng bàn phím (AC-F4-2)
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = useMemo(() => ordered.map((task) => task.id), [ordered]);

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;

    const next = arrayMove(ordered, from, to);
    setOrdered(next);

    const prev = next[to - 1]?.position ?? null;
    const nxt = next[to + 1]?.position ?? null;
    if (prev !== null && nxt !== null && Math.abs(nxt - prev) < 1e-6) {
      await normalizePositions(next);
      open.refetch();
      return;
    }
    reorder.mutate({ id: String(active.id), position: betweenPositions(prev, nxt) });
  }

  if (open.isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (open.isError) {
    return (
      <EmptyState
        title={t.common.error}
        action={
          <Button variant="secondary" onClick={() => open.refetch()}>
            {t.common.retry}
          </Button>
        }
      />
    );
  }

  const isEmpty = ordered.length === 0;

  return (
    <div className="grid gap-2">
      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-line/90 px-4 py-7 text-center">
          <p className="text-xs font-medium text-muted/80">{t.tasks.empty_body}</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {ordered.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={(done) => toggle.mutate({ id: task.id, done })}
                onEdit={() => setEditing(task)}
                onDelete={() => setDeleting(task)}
                onQuickStart={() => onQuickStart(task)}
                busy={start.isPending}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {completed.data && completed.data.length > 0 ? (
        <div className="mt-2 pt-2 border-t border-line/50">
          <button
            type="button"
            onClick={() => setShowDone((v) => !v)}
            aria-expanded={showDone}
            className="flex min-h-8 items-center gap-2 rounded-md px-1.5 text-xs font-semibold text-muted hover:text-ink cursor-pointer"
          >
            <span>{t.tasks.completed_section}</span>
            <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent-strong">{completed.data.length}</span>
          </button>
          {showDone ? (
            <div className="mt-2 grid gap-2">
              {completed.data.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={(done) => toggle.mutate({ id: task.id, done })}
                  onEdit={() => setEditing(task)}
                  onDelete={() => setDeleting(task)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <TaskEditDialog task={editing} onClose={() => setEditing(null)} />
      <TaskDeleteDialog
        task={deleting}
        onClose={() => setDeleting(null)}
        pending={remove.isPending}
        onConfirm={async () => {
          if (!deleting) return;
          await remove.mutateAsync(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
