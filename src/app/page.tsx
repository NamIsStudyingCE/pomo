"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseConfigured } from "@/lib/env";

// Client redirect: hoat dong duoc ca khi static export (output: "export") cho ban desktop.
// Ban offline (khong backend): vao thang /login de hien logo + the guest.
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(supabaseConfigured ? "/today" : "/login");
  }, [router]);
  return null;
}
