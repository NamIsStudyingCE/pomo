"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { finalizeSession } from "./api";
import { useSessionStore } from "./session-store";
import { computeActualSeconds } from "./time-math";
import { useProfile } from "@/modules/settings/hooks";

// Ba nốt ngắn bằng WebAudio, không cần file asset
function playCompletionSound() {
  try {
    const ctx = new AudioContext();
    [880, 1108.7, 1318.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const at = ctx.currentTime + i * 0.18;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.2, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.17);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.18);
    });
    setTimeout(() => void ctx.close(), 1200);
  } catch {
    // trình duyệt chặn audio: bỏ qua, không ảnh hưởng dữ liệu
  }
}

export function useFinalizeSession() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();

  return useCallback(
    async (reason: "completed" | "stopped_early") => {
      const s = useSessionStore.getState();
      if (s.status !== "running" || !s.sessionId) return;
      const now = Date.now();
      const actualSeconds =
        reason === "completed"
          ? Math.round(s.plannedMs / 1000)
          : computeActualSeconds(now, s.startedAtMs, s.distractionMs);

      await finalizeSession(s.sessionId, {
        ended_at: new Date(now).toISOString(),
        actual_focus_seconds: actualSeconds,
        distraction_seconds: Math.round(s.distractionMs / 1000),
        ended_reason: reason,
      });

      if (reason === "completed" && profile?.sound_enabled !== false) playCompletionSound();

      useSessionStore.getState().finish({
        actualSeconds,
        plannedMinutes: Math.round(s.plannedMs / 60_000),
        taskId: s.taskId,
        reason,
      });
      qc.invalidateQueries({ queryKey: ["sessions"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    [qc, profile],
  );
}
