"use client";

import { useEffect, useRef } from "react";
import { useSessionStore } from "./session-store";
import { useAmbientStore, TRACKS } from "./ambient-store";

/**
 * Controller chạy ngầm (mounted trong AppShell):
 * 1. Chơi audio liên tục xuyên suốt qua các trang khi đang trong phiên và user bật nhạc.
 * 2. TỰ ĐỘNG DỪNG NHẠC KHI:
 *    - Rời tab khỏi app (document.hidden === true).
 *    - Quay lại tab app: nếu phiên vẫn đang chạy và user trước đó đang nghe nhạc thì tự động phát tiếp.
 *    - Tắt bộ đếm ngược (session dừng sớm hoặc hết giờ - sessionStatus !== 'running').
 */
export function AmbientAudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionStatus = useSessionStore((s) => s.status);
  const isPlaying = useAmbientStore((s) => s.isPlaying);
  const userWantsPlay = useAmbientStore((s) => s.userWantsPlay);
  const currentTrack = useAmbientStore((s) => s.currentTrack);
  const volume = useAmbientStore((s) => s.volume);

  const activeTrack = TRACKS.find((t) => t.id === currentTrack) || TRACKS[0];

  // Khởi tạo audio element một lần duy nhất
  useEffect(() => {
    const audio = new Audio(activeTrack.src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Đồng bộ nguồn nhạc khi đổi track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const isCurrentPlaying = !audio.paused;
    audio.src = activeTrack.src;
    audio.currentTime = 0;
    if (isCurrentPlaying || isPlaying) {
      audio.play().catch(() => {
        useAmbientStore.getState().setPlaying(false);
      });
    }
  }, [activeTrack.src]);

  // Đồng bộ âm lượng
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Đồng bộ trạng thái phát theo store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (audio.paused) {
        audio.play().catch(() => {
          useAmbientStore.getState().setPlaying(false);
        });
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [isPlaying]);

  // 1. TẮT BỘ ĐẾM NGƯỢC (Session kết thúc / dừng sớm) -> DỪNG NHẠC NGAY
  useEffect(() => {
    if (sessionStatus !== "running") {
      if (useAmbientStore.getState().isPlaying) {
        useAmbientStore.getState().setPlaying(false);
      }
      useAmbientStore.getState().setUserWantsPlay(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [sessionStatus]);

  // 2. RỜI TAB KHỎI APP (Tab visibility change) -> DỪNG NHẠC KHI ẨN TAB
  useEffect(() => {
    function handleVisibilityChange() {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        // Người dùng tab khỏi app: NGỪNG NHẠC NGAY LẬP TỨC
        audio.pause();
        useAmbientStore.getState().setPlaying(false);
      } else {
        // Người dùng quay lại tab app:
        // Nếu phiên vẫn đang chạy và người dùng trước đó đã bật nhạc thì TIẾP TỤC PHÁT
        const store = useAmbientStore.getState();
        const currentSession = useSessionStore.getState();
        if (currentSession.status === "running" && store.userWantsPlay) {
          audio
            .play()
            .then(() => {
              store.setPlaying(true);
            })
            .catch(() => {
              store.setPlaying(false);
            });
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
