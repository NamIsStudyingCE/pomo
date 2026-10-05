"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/AuthProvider";
import { useT } from "@/modules/i18n";
import { Skeleton } from "@/design-system/data-display";

// supabase-js tự đổi PKCE code trong URL (detectSessionInUrl);
// trang này chỉ đợi session rồi điều hướng.
export default function AuthCallbackPage() {
  const { status, session } = useAuth();
  const router = useRouter();
  const { t } = useT();

  useEffect(() => {
    if (status === "ready" && session) router.replace("/today");
    if (status === "ready" && !session) {
      const timer = setTimeout(() => router.replace("/login"), 4000);
      return () => clearTimeout(timer);
    }
  }, [status, session, router]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 px-4">
      <p className="text-sm text-muted">{t.auth.logging_in}</p>
      <Skeleton className="h-11 w-full" />
    </main>
  );
}
