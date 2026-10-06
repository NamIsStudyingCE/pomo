import { requireSupabase, getSupabase } from "@/lib/supabase-browser";
import { isGuestMode, setGuestMode } from "./guest-storage";

export async function sendMagicLink(email: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  if (isGuestMode()) {
    setGuestMode(false);
    return;
  }
  const sb = getSupabase();
  if (sb) {
    await sb.auth.signOut();
  }
}
