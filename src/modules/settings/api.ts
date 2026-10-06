import { requireSupabase } from "@/lib/supabase-browser";
import { isGuestMode, getGuestProfile, saveGuestProfile } from "@/modules/auth/guest-storage";
import type { Locale } from "@/modules/i18n";

export interface Profile {
  id: string;
  display_name: string | null;
  daily_goal_minutes: number;
  preferred_session_minutes: number;
  locale: Locale;
  sound_enabled: boolean;
  created_at: string;
}

export async function fetchProfile(): Promise<Profile | null> {
  if (isGuestMode()) {
    return getGuestProfile();
  }
  const sb = requireSupabase();
  const { data, error } = await sb.from("profiles").select("*").single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  patch: Partial<Pick<Profile, "daily_goal_minutes" | "preferred_session_minutes" | "locale" | "sound_enabled">>,
): Promise<void> {
  if (isGuestMode()) {
    saveGuestProfile(patch);
    return;
  }
  const sb = requireSupabase();
  const { error } = await sb.from("profiles").update(patch).eq("id", (await sb.auth.getUser()).data.user?.id);
  if (error) throw error;
}
