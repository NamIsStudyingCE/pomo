"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeSimple, User } from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/AuthProvider";
import { sendMagicLink } from "@/modules/auth/api";
import { useT } from "@/modules/i18n";
import { Button } from "@/design-system/Button";
import { Field, Input } from "@/design-system/Input";
import { AnimatedLogo } from "@/modules/auth/AnimatedLogo";

export default function LoginPage() {
  const { t } = useT();
  const { status, session, configured, loginAsGuest } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    if (status === "ready" && session) router.replace("/today");
  }, [status, session, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setErrorDetail("");
    try {
      await sendMagicLink(email.trim());
      setState("sent");
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setState("error");
    }
  }

  function handleGuestLogin() {
    loginAsGuest();
    router.replace("/today");
  }

  if (configured && status === "ready" && session) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-4">
      {/* Animation Logo */}
      <AnimatedLogo />

      {!configured ? (
        <div className="grid gap-4 rounded-lg border border-line bg-surface p-4 text-sm text-muted">
          <p>{t.config.missing_title}. {t.config.missing_body}</p>
          <Button variant="secondary" onClick={handleGuestLogin}>
            <User size={18} />
            {t.auth.login_as_guest}
          </Button>
        </div>
      ) : state === "sent" ? (
        <div className="grid gap-2 rounded-lg border border-line bg-surface p-4">
          <p className="font-semibold">{t.auth.check_email_title}</p>
          <p className="text-sm text-muted">{t.auth.check_email_body}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <form onSubmit={onSubmit} className="grid gap-4">
            <Field label={t.auth.email_label}>
              <Input
                type="email"
                required
                autoComplete="email"
                placeholder={t.auth.email_placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            {state === "error" ? (
              <div className="grid gap-1">
                <p className="text-sm text-danger">{t.auth.login_error}</p>
                {errorDetail ? (
                  <p className="rounded-lg border border-line bg-paper px-3 py-2 text-xs break-all text-muted">
                    {errorDetail}
                  </p>
                ) : null}
              </div>
            ) : null}
            <Button type="submit" disabled={state === "sending"}>
              <EnvelopeSimple size={18} />
              {state === "sending" ? t.auth.sending : t.auth.send_link}
            </Button>
          </form>

          {/* Đường phân cách hoặc */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-line/60" />
            <span className="absolute bg-paper px-3 text-xs uppercase tracking-wider text-muted">
              {t.auth.or_divider}
            </span>
          </div>

          {/* Nút Đăng nhập với tư cách Khách */}
          <div className="grid gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleGuestLogin}
              className="w-full justify-center border-dashed border-[#B89F82] dark:border-[#8C7A6B] bg-paper hover:bg-surface hover:border-accent-strong"
            >
              <User size={18} className="text-accent-strong" />
              <span>{t.auth.login_as_guest}</span>
            </Button>
            <p className="text-center text-[11px] text-muted">
              {t.auth.guest_hint}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
