"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChartBar, GearSix, House, SidebarSimple, Timer, X } from "@phosphor-icons/react";
import { useT } from "@/modules/i18n";
import { useAuth } from "@/modules/auth/AuthProvider";
import { useSessionStore } from "@/modules/focus/session-store";
import { useSessionBootstrap } from "@/modules/focus/useSessionBootstrap";
import { SessionEngine } from "@/modules/focus/SessionEngine";
import { AmbientAudioController } from "@/modules/focus/AmbientAudioController";
import { useProfile } from "@/modules/settings/hooks";
import { formatClock } from "@/lib/time";
import { InstallPwaButton } from "@/modules/focus/InstallPwaButton";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/today", key: "today", Icon: House },
  { href: "/review", key: "review", Icon: ChartBar },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, setLocale } = useT();
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useAuth();
  const remainingSeconds = useSessionStore((s) => s.remainingSeconds);
  const sessionStatus = useSessionStore((s) => s.status);
  const { data: profile } = useProfile();

  // Trang thai thu gon / mo rong sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pomo-sidebar-collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  function toggleCollapsed() {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pomo-sidebar-collapsed", String(next));
      } catch {}
      return next;
    });
  }

  // Phim tat Ctrl+B hoac Cmd+B de dong/mo sidebar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapsed();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Khôi phục session đang chạy (nếu có) sau refresh
  useSessionBootstrap();

  // Đồng bộ ngôn ngữ từ profile (nguồn thật) về UI
  useEffect(() => {
    if (profile?.locale) setLocale(profile.locale);
  }, [profile?.locale, setLocale]);

  const showSessionBar = sessionStatus === "running" && pathname !== "/focus";

  // Ten hien thi: display_name tu profile, rot ve email khi chua dat
  const displayName = profile?.display_name || session?.user.email || "P";

  // Phim tat chuyen trang nhanh: 1 = Hom nay, 2 = Tuan nay, 3 = Cai dat
  useEffect(() => {
    function handleNavKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isInput) return;

      if (e.key === "1") router.push("/today");
      if (e.key === "2") router.push("/review");
      if (e.key === "3") router.push("/settings");
    }
    window.addEventListener("keydown", handleNavKey);
    return () => window.removeEventListener("keydown", handleNavKey);
  }, [router]);

  return (
    <div className="flex min-h-dvh w-full">
      {/* Sidebar desktop: ho tro Thu gon / Mo rong */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-paper md:flex transition-[width] duration-300 ease-in-out",
          isCollapsed ? "w-16 px-2 py-4" : "w-56 px-3 py-4",
        )}
      >
        {isCollapsed ? (
          /* Che do Thu gon (Collapsed): Logo P. tu dong doi thanh Nut mo rong khi hover */
          <>
            <div className="mb-5 flex justify-center">
              <button
                type="button"
                onClick={toggleCollapsed}
                className="group relative flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-accent-soft/40 cursor-pointer"
                title="Mở rộng thanh bên (Ctrl+B)"
                aria-label="Mở rộng thanh bên"
              >
                {/* Trang thai binh thuong: Logo P. */}
                <span className="absolute flex items-center justify-center text-2xl font-bold tracking-tight transition-all duration-200 ease-in-out group-hover:scale-75 group-hover:opacity-0">
                  P<span className="text-accent-strong">.</span>
                </span>
                {/* Trang thai hover: Doi thanh nut mo rong SidebarSimple */}
                <span className="absolute flex items-center justify-center text-muted transition-all duration-200 ease-in-out scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:text-ink">
                  <SidebarSimple size={20} />
                </span>
              </button>
            </div>

            <nav className="grid gap-1.5">
              {NAV.map(({ href, key, Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    title={t.nav[key]}
                    className={cn(
                      "mx-auto flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-accent-soft text-accent-strong"
                        : "text-muted hover:bg-accent-soft/40 hover:text-ink",
                    )}
                  >
                    <Icon size={20} weight={active ? "fill" : "regular"} />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col items-center gap-3 border-t border-line/60 pt-3">
              <Link
                href="/settings"
                aria-label={t.nav.settings}
                aria-current={pathname.startsWith("/settings") ? "page" : undefined}
                title={t.nav.settings}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  pathname.startsWith("/settings")
                    ? "bg-accent-soft text-accent-strong"
                    : "text-muted hover:bg-accent-soft/40 hover:text-ink",
                )}
              >
                <GearSix size={19} />
              </Link>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong text-xs font-semibold uppercase cursor-default"
                title={displayName}
              >
                {displayName[0]}
              </div>
            </div>
          </>
        ) : (
          /* Che do Mo rong (Expanded): Logo Pomo. + Nut thu gon ben phai, Menu co chu, User & Settings o duoi */
          <>
            <div className="mb-6 flex items-center justify-between px-2">
              <Link
                href="/today"
                className="text-2xl font-bold tracking-tight text-ink hover:opacity-90 transition-opacity"
              >
                Pomo<span className="text-accent-strong">.</span>
              </Link>
              <button
                type="button"
                onClick={toggleCollapsed}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-accent-soft/40 hover:text-ink transition-colors cursor-pointer"
                title="Thu gọn thanh bên (Ctrl+B)"
                aria-label="Thu gọn thanh bên"
              >
                <SidebarSimple size={19} />
              </button>
            </div>

            <nav className="grid gap-1">
              {NAV.map(({ href, key, Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-accent-soft text-accent-strong"
                        : "text-muted hover:bg-accent-soft/40 hover:text-ink",
                    )}
                  >
                    <Icon size={19} weight={active ? "fill" : "regular"} />
                    <span>{t.nav[key]}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex items-center gap-2.5 border-t border-line/60 px-2 pt-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong text-xs font-semibold uppercase">
                {displayName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink" title={session?.user.email}>
                  {displayName}
                </p>
              </div>
              <Link
                href="/settings"
                aria-label={t.nav.settings}
                aria-current={pathname.startsWith("/settings") ? "page" : undefined}
                title={t.nav.settings}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  pathname.startsWith("/settings")
                    ? "bg-accent-soft text-accent-strong"
                    : "text-muted hover:bg-accent-soft/40 hover:text-ink",
                )}
              >
                <GearSix size={18} />
              </Link>
            </div>
          </>
        )}
      </aside>

      {/* Cột nội dung */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur md:hidden">
          <Link href="/today" className="text-xl font-bold tracking-tight">
            Pomo<span className="text-accent-strong">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <InstallPwaButton />
            {pathname.startsWith("/settings") ? (
              <div className="flex items-center gap-2">
                {sessionStatus === "running" ? (
                  <span className="tnum text-xs font-semibold text-accent-strong">
                    {formatClock(remainingSeconds)}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => router.back()}
                  aria-label="Đóng cài đặt"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:text-ink cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/settings"
                aria-label={t.nav.settings}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:text-ink"
              >
                <GearSix size={20} />
              </Link>
            )}
          </div>
        </header>

        {/* Topbar desktop cho nut Tai ung dung (tuong tu goc tren ben phai cua Gemini) */}
        <div className="hidden h-12 items-center justify-end px-8 pt-3 md:flex">
          <InstallPwaButton />
        </div>

        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-2xl">
            {children}
          </div>
        </main>

        <SessionEngine />
        <AmbientAudioController />

        {/* Thanh session đang chạy (desktop) */}
        {showSessionBar ? (
          <Link
            href="/focus"
            className="tnum fixed right-6 bottom-6 hidden min-h-10 items-center gap-2 rounded-lg border border-accent-strong/40 bg-accent px-3.5 text-xs font-semibold text-white transition-colors hover:brightness-95 md:inline-flex"
          >
            <Timer size={16} weight="fill" />
            <span>{t.focus.active_bar}</span>
            <span className="opacity-70">·</span>
            <span>{formatClock(remainingSeconds)}</span>
          </Link>
        ) : null}

        {/* Bottom nav mobile */}
        <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          <div className="grid grid-cols-2">
            {NAV.map(({ href, key, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium",
                    active ? "text-accent-strong" : "text-muted",
                  )}
                >
                  <Icon size={22} weight={active ? "fill" : "regular"} />
                  {t.nav[key]}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
