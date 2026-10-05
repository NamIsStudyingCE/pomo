import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

// Hover bằng brightness-90 thay vì đổi màu: giữ contrast text ở mọi theme (antislop-human)
const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:brightness-90 active:translate-y-px",
  secondary: "bg-surface border border-line text-ink hover:bg-accent-soft/50 active:translate-y-px",
  ghost: "text-muted hover:bg-accent-soft/50 hover:text-ink",
  danger: "bg-danger text-white hover:brightness-90 active:translate-y-px",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-sm font-semibold",
  sm: "min-h-9 px-3 text-sm font-medium",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg whitespace-nowrap transition-colors",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});
