import { requireSupabase } from "@/lib/supabase-browser";

export async function sendMagicLink(email: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const sb = requireSupabase();
  await sb.auth.signOut();
}
