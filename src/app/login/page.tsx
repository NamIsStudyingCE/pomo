"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeSimple } from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/AuthProvider";
import { sendMagicLink } from "@/modules/auth/api";
import { useT } from "@/modules/i18n";
import { Button } from "@/design-system/Button";
import { Field, Input } from "@/design-system/Input";

export default function LoginPage() {
  const { t } = useT();
  const { status, session, configured } = useAuth();
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
      // Hiện message thật từ Supabase để chẩn đoán (rate limit, redirect URL, API key...)
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setState("error");
    }
  }

  if (configured && status === "ready" && session) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-8 px-4">
      <div className="grid gap-2">
        <p className="text-3xl font-bold tracking-tight">
          {t.auth.login_title}
          <span className="text-accent">.</span>
        </p>
        <p className="text-muted">{t.auth.login_subtitle}</p>
      </div>

      {!configured ? (
        <p className="rounded-lg border border-line bg-surface p-4 text-sm text-muted">
          {t.config.missing_title}. {t.config.missing_body}
        </p>
      ) : state === "sent" ? (
        <div className="grid gap-2 rounded-lg border border-line bg-surface p-4">
          <p className="font-semibold">{t.auth.check_email_title}</p>
          <p className="text-sm text-muted">{t.auth.check_email_body}</p>
        </div>
      ) : (
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
      )}
    </main>
  );
}
