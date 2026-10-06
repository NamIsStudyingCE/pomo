"use client";

import { useEffect, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { useT } from "@/modules/i18n";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

// Lưu deferredPrompt ở phạm vi toàn cục phòng trường hợp event bắn ra trước khi component mount
let globalInstallPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalInstallPrompt = e as BeforeInstallPromptEvent;
  });
}

export function InstallPwaButton({ className }: { className?: string }) {
  const { t } = useT();
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Kiểm tra chế độ standalone
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (globalInstallPrompt) {
      setCanInstall(true);
    }

    function handlePrompt(e: Event) {
      e.preventDefault();
      globalInstallPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    }

    function handleAppInstalled() {
      globalInstallPrompt = null;
      setCanInstall(false);
      setIsStandalone(true);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (isStandalone) {
    return null;
  }

  async function handleInstall() {
    if (globalInstallPrompt) {
      try {
        await globalInstallPrompt.prompt();
        const choice = await globalInstallPrompt.userChoice;
        if (choice.outcome === "accepted") {
          globalInstallPrompt = null;
          setCanInstall(false);
        }
      } catch {}
    }
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      title={t.common.install_app}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs font-medium text-ink transition-all hover:border-accent-strong hover:bg-surface hover:text-accent-strong shadow-xs",
        className
      )}
    >
      <DownloadSimple size={15} weight="bold" className="text-accent-strong" />
      <span>{t.common.install_app}</span>
    </button>
  );
}
