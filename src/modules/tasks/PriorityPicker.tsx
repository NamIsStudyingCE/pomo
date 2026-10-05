"use client";

import { SegmentedControl } from "@/design-system/SegmentedControl";
import { useT } from "@/modules/i18n";
import type { Priority } from "./types";

export function PriorityPicker({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (p: Priority) => void;
}) {
  const { t } = useT();
  return (
    <SegmentedControl
      ariaLabel={t.tasks.deadline_label}
      value={value}
      onChange={onChange}
      options={[
        { value: "high", label: t.tasks.priority_high },
        { value: "medium", label: t.tasks.priority_medium },
        { value: "low", label: t.tasks.priority_low },
      ]}
    />
  );
}

// Chấm ưu tiên: khác biệt bằng độ đậm, không cầu vồng màu (DESIGN.md)
export function PriorityDot({ priority }: { priority: Priority }) {
  const cls =
    priority === "high" ? "bg-accent" : priority === "medium" ? "bg-muted" : "bg-line";
  return <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${cls}`} />;
}
