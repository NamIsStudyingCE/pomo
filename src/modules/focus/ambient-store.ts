"use client";

import { create } from "zustand";

export type SoundTrack = "lofi" | "rain" | "fire";

export const TRACKS: { id: SoundTrack; label: string; src: string }[] = [
  { id: "lofi", label: "Lo-fi Rhodes", src: "/ambient/lofi.wav" },
  { id: "rain", label: "Mưa êm", src: "/ambient/rain.wav" },
  { id: "fire", label: "Lò sưởi", src: "/ambient/fire.wav" },
];

interface AmbientStore {
  isPlaying: boolean;
  userWantsPlay: boolean; // Người dùng đã chủ động bật nhạc
  currentTrack: SoundTrack;
  volume: number;
  showControls: boolean;

  setPlaying: (playing: boolean) => void;
  setUserWantsPlay: (wants: boolean) => void;
  setTrack: (track: SoundTrack) => void;
  setVolume: (volume: number) => void;
  setShowControls: (show: boolean | ((prev: boolean) => boolean)) => void;
  togglePlay: () => void;
}

export const useAmbientStore = create<AmbientStore>((set, get) => ({
  isPlaying: false,
  userWantsPlay: false,
  currentTrack: "lofi",
  volume: 0.4,
  showControls: false,

  setPlaying: (isPlaying) => set({ isPlaying }),
  setUserWantsPlay: (userWantsPlay) => set({ userWantsPlay }),
  setTrack: (currentTrack) => set({ currentTrack }),
  setVolume: (volume) => set({ volume }),
  setShowControls: (show) =>
    set((state) => ({
      showControls: typeof show === "function" ? show(state.showControls) : show,
    })),
  togglePlay: () => {
    const next = !get().isPlaying;
    set({ isPlaying: next, userWantsPlay: next });
  },
}));
