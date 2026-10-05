"use client";

import { cn } from "@/lib/utils";

type Option<T extends string | number> = { value: T; label: React.ReactNode };

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("inline-flex rounded-lg border border-line bg-paper p-1", className)}
    >
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "min-h-9 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors",
            opt.value === value ? "bg-surface text-ink border border-line/70" : "text-muted hover:text-ink border border-transparent",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
