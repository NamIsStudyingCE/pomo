"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile, type Profile } from "./api";

export function useProfile() {
  return useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Pick<Profile, "daily_goal_minutes" | "preferred_session_minutes" | "locale" | "sound_enabled">>) =>
      updateProfile(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}
