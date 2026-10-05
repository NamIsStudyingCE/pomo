"use client";

import { useEffect, useState } from "react";
import { SegmentedControl } from "@/design-system/SegmentedControl";
import { useT } from "@/modules/i18n";

export type ThemeMode = "system" | "light" | "dark";

export function applyTheme(mode: ThemeMode) {
  const dark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  try {
    if (mode === "system") window.localStorage.removeItem("pomo-theme");
    else window.localStorage.setItem("pomo-theme", mode);
  } catch {
    // private mode
  }
}

export function currentTheme(): ThemeMode {
  const v = window.localStorage.getItem("pomo-theme");
  return v === "dark" || v === "light" ? v : "system";
}

export function ThemeToggle() {
  const { t } = useT();
  // Mode trong state (doc localStorage sau mount): highlight di theo dung lua chon,
  // khong ket o gia tri cu roi nhay muon nhu khi doc truc tiep trong render.
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    setMode(currentTheme());
  }, []);

  return (
    <SegmentedControl
      ariaLabel={t.settings.theme}
      value={mode}
      onChange={(m) => {
        setMode(m);
        applyTheme(m);
      }}
      options={[
        { value: "system", label: t.settings.theme_system },
        { value: "light", label: t.settings.theme_light },
        { value: "dark", label: t.settings.theme_dark },
      ]}
    />
  );
}
