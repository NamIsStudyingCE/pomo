import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-line bg-surface p-4", className)}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent" | "danger";
  className?: string;
}) {
  const tones = {
    muted: "bg-accent-soft/40 text-muted",
    accent: "bg-accent-soft text-accent-strong",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Progress({ ratio, className }: { ratio: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, Math.round(ratio * 100)));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-accent-soft/70", className)}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-accent-soft/60", className)} />;
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-10 text-center", className)}>
      {icon ? <div className="text-muted">{icon}</div> : null}
      <p className="font-semibold">{title}</p>
      {body ? <p className="max-w-[45ch] text-sm text-muted">{body}</p> : null}
      {action}
    </div>
  );
}


