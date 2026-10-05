"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CloudSlash } from "@phosphor-icons/react";
import { useAuth } from "./AuthProvider";
import { useT } from "@/modules/i18n";
import { EmptyState, Skeleton } from "@/design-system/data-display";

// Bảo vệ nhóm route (app): chưa đăng nhập thì đưa về /login.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status, session, configured } = useAuth();
  const router = useRouter();
  const { t } = useT();

  useEffect(() => {
    if (status === "ready" && configured && !session) router.replace("/login");
  }, [status, session, configured, router]);

  if (!configured) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md items-center px-4">
        <EmptyState
          icon={<CloudSlash size={40} weight="duotone" />}
          title={t.config.missing_title}
          body={t.config.missing_body}
        />
      </main>
    );
  }

  if (status === "loading" || !session) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-2xl content-start gap-4 px-4 py-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
