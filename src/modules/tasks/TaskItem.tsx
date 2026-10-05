"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, DotsSixVertical, PencilSimple, Play, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useT } from "@/modules/i18n";
import { dayKey } from "@/lib/time";
import { Badge } from "@/design-system/data-display";
import { PriorityDot } from "./PriorityPicker";
import type { Task } from "./types";

function DeadlineChip({ deadline }: { deadline: string }) {
  const { t } = useT();
  const today = dayKey(new Date());
  const tomorrow = dayKey(new Date(Date.now() + 86_400_000));
  let label = deadline;
  let tone: "muted" | "accent" | "danger" = "muted";
  if (deadline < today) {
    label = t.tasks.overdue;
    tone = "danger";
  } else if (deadline === today) {
    label = t.tasks.due_today;
    tone = "accent";
  } else if (deadline === tomorrow) {
    label = t.tasks.due_tomorrow;
  } else {
    const d = new Date(`${deadline}T00:00:00`);
    label = d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }
  return <Badge tone={tone}>{label}</Badge>;
}

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  onQuickStart,
  busy,
}: {
  task: Task;
  onToggle: (done: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onQuickStart?: () => void;
  busy?: boolean;
}) {
  const { t } = useT();
  const done = task.completed_at !== null;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: done,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2.5 transition-colors",
        isDragging && "z-10 shadow-sm border-accent-strong/50",
        done && "opacity-60",
      )}
    >
      {!done ? (
        <button
          type="button"
          aria-label={task.title}
          className="cursor-grab touch-none rounded p-1 text-muted/60 hover:text-ink active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <DotsSixVertical size={16} />
        </button>
      ) : null}

      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? t.tasks.mark_undone : t.tasks.mark_done}
        onClick={() => onToggle(!done)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors cursor-pointer",
          done ? "border-accent bg-accent text-white" : "border-muted/40 hover:border-accent-strong",
        )}
      >
        {done ? <Check size={12} weight="bold" /> : null}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium leading-snug", done && "line-through text-muted")}>{task.title}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs">
          <PriorityDot priority={task.priority} />
          <span className="text-[11px] text-muted">
            {task.priority === "high"
              ? t.tasks.priority_high
              : task.priority === "medium"
                ? t.tasks.priority_medium
                : t.tasks.priority_low}
          </span>
          {task.deadline && !done ? <DeadlineChip deadline={task.deadline} /> : null}
        </div>
      </div>

      <div className="flex items-center gap-0.5 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        {!done && onQuickStart ? (
          <button
            type="button"
            onClick={onQuickStart}
            disabled={busy}
            aria-label={t.tasks.quick_start}
            title={t.tasks.quick_start}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-soft hover:text-accent-strong cursor-pointer disabled:opacity-50"
          >
            <Play size={16} weight="fill" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onEdit}
          aria-label={t.tasks.edit_task}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-soft/40 hover:text-ink cursor-pointer"
        >
          <PencilSimple size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={t.tasks.delete_task}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-danger/10 hover:text-danger cursor-pointer"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
}
