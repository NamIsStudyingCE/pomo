"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { vi, type Messages } from "./vi";
import { en } from "./en";

export type Locale = "vi" | "en";

const DICTS: Record<Locale, Messages> = { vi, en };
const STORAGE_KEY = "pomo-locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "vi";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "en" ? "en" : "vi";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // private mode: giữ state trong bộ nhớ là đủ
    }
    document.documentElement.lang = l;
  }, []);

  const value = useMemo(() => ({ locale, setLocale, t: DICTS[locale] }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT phải nằm trong I18nProvider");
  return ctx;
}
