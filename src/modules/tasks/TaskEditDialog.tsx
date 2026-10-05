"use client";

import { useEffect, useState } from "react";
import { useT } from "@/modules/i18n";
import { Dialog } from "@/design-system/Dialog";
import { Button } from "@/design-system/Button";
import { Field, Input } from "@/design-system/Input";
import { PriorityPicker } from "./PriorityPicker";
import { useUpdateTask } from "./hooks";
import type { Priority, Task } from "./types";

export function TaskEditDialog({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  const { t } = useT();
  const update = useUpdateTask();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setDeadline(task.deadline ?? "");
    }
  }, [task]);

  async function onSave() {
    if (!task || !title.trim()) return;
    await update.mutateAsync({
      id: task.id,
      title: title.trim().slice(0, 200),
      priority,
      deadline: deadline || null,
    });
    onClose();
  }

  return (
    <Dialog open={task !== null} onClose={onClose} title={t.tasks.edit_task}>
      <div className="grid gap-4">
        <Field label={t.tasks.title_label}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
        </Field>
        <Field label={t.tasks.deadline_label}>
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </Field>
        <PriorityPicker value={priority} onChange={setPriority} />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={onSave} disabled={!title.trim() || update.isPending}>
            {t.common.save}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export function TaskDeleteDialog({
  task,
  onClose,
  onConfirm,
  pending,
}: {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => void;
  pending: boolean;
}) {
  const { t } = useT();
  return (
    <Dialog open={task !== null} onClose={onClose} title={t.tasks.delete_title}>
      <p className="mb-1 font-medium">{task?.title}</p>
      <p className="mb-4 text-sm text-muted">{t.tasks.delete_body}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          {t.common.cancel}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={pending}>
          {t.common.delete}
        </Button>
      </div>
    </Dialog>
  );
}
