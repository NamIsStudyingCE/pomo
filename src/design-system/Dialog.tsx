"use client";

import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// Native <dialog>: có sẵn focus trap, đóng bằng Escape, backdrop.
type DialogProps = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  description?: React.ReactNode;
  showCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  showCloseButton = true,
  children,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // click vào vùng backdrop (chính phần tử dialog) thì đóng
        if (e.target === ref.current) onClose?.();
      }}
      className={cn(
        "m-auto w-[min(92vw,28rem)] rounded-lg border border-line bg-surface p-5 text-ink shadow-pop",
        "backdrop:bg-black/30 backdrop:backdrop-blur-[1px]",
        className,
      )}
    >
      {title ? (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-semibold leading-tight">{title}</h2>
            {description ? <div className="mt-1">{description}</div> : null}
          </div>
          {onClose && showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="-mr-1.5 -mt-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-paper hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>
      ) : null}
      {children}
    </dialog>
  );
}
