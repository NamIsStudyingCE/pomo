"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { useT } from "@/modules/i18n";
import { cn } from "@/lib/utils";
import { useCreateTask } from "./hooks";

// Tạo task chỉ với tiêu đề (AC-F1-1); priority/deadline chỉnh sau qua dialog sửa.
export function TaskComposer() {
  const { t } = useT();
  const [title, setTitle] = useState("");
  const create = useCreateTask();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || create.isPending) return;
    await create.mutateAsync({ title: trimmed.slice(0, 200), priority: "medium", deadline: null });
    setTitle("");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "group relative flex items-center rounded-lg border border-line bg-surface transition-colors",
        "focus-within:border-accent-strong focus-within:ring-2 focus-within:ring-accent-strong/15",
      )}
    >
      <div className="pointer-events-none absolute left-3.5 flex items-center text-muted/60 transition-colors group-focus-within:text-accent-strong">
        <Plus size={16} weight="bold" />
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t.tasks.add_placeholder}
        maxLength={200}
        aria-label={t.tasks.title_label}
        className="h-11 w-full bg-transparent pl-10 pr-24 text-sm text-ink placeholder:text-muted/60 focus:outline-none"
      />
      <div className="absolute right-1.5 flex items-center gap-1.5">
        <button
          type="submit"
          disabled={!title.trim() || create.isPending}
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors cursor-pointer",
            title.trim()
              ? "bg-accent text-white hover:brightness-90"
              : "bg-accent-soft/40 text-muted/70 cursor-not-allowed",
          )}
        >
          <span>{t.tasks.add_button}</span>
        </button>
      </div>
    </form>
  );
}
