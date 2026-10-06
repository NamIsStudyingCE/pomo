"use client";

import { useEffect, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { useT } from "@/modules/i18n";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPwaButton({ className }: { className?: string }) {
  const { t } = useT();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Kiem tra xem app dang chay o che do app/standalone hay chua
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Dang ky Service Worker neu trinh duyet ho tro
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Lang nghe su kien beforeinstallprompt
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Neu da cai va dang chay standalone roi thi khong can hien nut tai nua
  if (isStandalone) {
    return null;
  }

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      // Huong dan truc quan neu trinh duyet da xu ly san hoac can bam tren thanh dia chi
      alert(
        "Để cài đặt Pomo thành ứng dụng riêng:\n\n1. Nhấn vào biểu tượng Cài đặt (Install / ⊕ / 🖥️) ở góc phải thanh địa chỉ trình duyệt.\n2. Chọn 'Cài đặt' (Install).\n\nỨng dụng sẽ có logo P. riêng biệt trên Taskbar và màn hình Desktop của bạn!"
      );
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
