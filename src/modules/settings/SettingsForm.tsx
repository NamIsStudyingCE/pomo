"use client";

import { useEffect, useRef, useState } from "react";
import { SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useT, type Locale } from "@/modules/i18n";
import { useAuth } from "@/modules/auth/AuthProvider";
import { signOut } from "@/modules/auth/api";
import { Button } from "@/design-system/Button";
import { Card, Skeleton } from "@/design-system/data-display";
import { Input } from "@/design-system/Input";
import { SegmentedControl } from "@/design-system/SegmentedControl";
import { Switch } from "@/design-system/Switch";
import { useProfile, useUpdateProfile } from "./hooks";
import { ThemeToggle } from "./ThemeToggle";

// Moi cai dat luu ngay khi doi, khong nut Save, khong thong bao (thong bao them sau).
export function SettingsForm() {
  const { t, locale: globalLocale, setLocale } = useT();
  const { session } = useAuth();
  const router = useRouter();
  const profile = useProfile();
  const update = useUpdateProfile();

  const [goal, setGoal] = useState(120);
  const [sessionLen, setSessionLen] = useState(25);
  const [sound, setSound] = useState(true);
  const goalRef = useRef<HTMLInputElement>(null);
  const sessionLenRef = useRef<HTMLInputElement>(null);

  // Dong bo tu profile, nhung khong ghi de o dang duoc sua
  useEffect(() => {
    if (!profile.data) return;
    if (document.activeElement !== goalRef.current) setGoal(profile.data.daily_goal_minutes);
    if (document.activeElement !== sessionLenRef.current) {
      setSessionLen(profile.data.preferred_session_minutes);
    }
    setSound(profile.data.sound_enabled);
  }, [profile.data]);

  // So: luu khi roi o (blur) hoac Enter, tranh ban mutation tung ky tu
  function commitGoal() {
    const v = Math.min(960, Math.max(15, Math.round(goal) || 120));
    setGoal(v);
    update.mutate({ daily_goal_minutes: v });
  }

  function commitSessionLen() {
    const v = Math.min(120, Math.max(5, Math.round(sessionLen) || 25));
    setSessionLen(v);
    update.mutate({ preferred_session_minutes: v });
  }

  function onLocaleChange(l: Locale) {
    setLocale(l);
    update.mutate({ locale: l });
  }

  function onSoundChange(v: boolean) {
    setSound(v);
    update.mutate({ sound_enabled: v });
  }

  if (profile.isLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="grid max-w-lg gap-6">
      <Card className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="goal" className="text-sm font-medium">
            {t.settings.goal_label}
          </label>
          <div className="flex items-center gap-2">
            <Input
              ref={goalRef}
              id="goal"
              type="number"
              min={15}
              max={960}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              onBlur={commitGoal}
              onKeyDown={(e) => {
                if (e.key === "Enter") goalRef.current?.blur();
              }}
              className="tnum w-20 px-2 text-center"
            />
            <span className="text-sm text-muted">{t.common.minutes_unit}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="session-len" className="text-sm font-medium">
            {t.settings.session_len}
          </label>
          <div className="flex items-center gap-2">
            <Input
              ref={sessionLenRef}
              id="session-len"
              type="number"
              min={5}
              max={120}
              value={sessionLen}
              onChange={(e) => setSessionLen(Number(e.target.value))}
              onBlur={commitSessionLen}
              onKeyDown={(e) => {
                if (e.key === "Enter") sessionLenRef.current?.blur();
              }}
              className="tnum w-20 px-2 text-center"
            />
            <span className="text-sm text-muted">{t.common.minutes_unit}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">{t.settings.sound}</span>
          <Switch checked={sound} onChange={onSoundChange} label={t.settings.sound} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">{t.settings.locale}</span>
          <SegmentedControl
            ariaLabel={t.settings.locale}
            value={globalLocale}
            onChange={onLocaleChange}
            options={[
              { value: "vi", label: "Tiếng Việt" },
              { value: "en", label: "English" },
            ]}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">{t.settings.theme}</span>
          <ThemeToggle />
        </div>
      </Card>

      <Card className="grid gap-3">
        <p className="text-sm font-semibold">{t.settings.account}</p>
        <p className="truncate text-sm text-muted">{session?.user.email}</p>
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              await signOut();
              router.replace("/login");
            }}
          >
            <SignOut size={16} />
            {t.nav.logout}
          </Button>
        </div>
      </Card>
    </div>
  );
}
