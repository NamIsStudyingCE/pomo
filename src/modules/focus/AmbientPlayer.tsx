"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SpeakerSimpleHigh, SpeakerSimpleLow, SpeakerSimpleX } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type SoundTrack = "lofi" | "rain" | "fire";

const TRACKS: { id: SoundTrack; label: string; src: string }[] = [
  { id: "lofi", label: "Lo-fi Rhodes", src: "/ambient/lofi.wav" },
  { id: "rain", label: "Mưa êm", src: "/ambient/rain.wav" },
  { id: "fire", label: "Lò sưởi", src: "/ambient/fire.wav" },
];

export function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SoundTrack>("lofi");
  const [volume, setVolume] = useState(0.4);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = TRACKS.find((t) => t.id === currentTrack) || TRACKS[0];

  useEffect(() => {
    const audio = new Audio(activeTrack.src);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Thay doi track
  function handleSelectTrack(trackId: SoundTrack) {
    setCurrentTrack(trackId);
    const target = TRACKS.find((t) => t.id === trackId);
    if (!target || !audioRef.current) return;

    const wasPlaying = isPlaying;
    audioRef.current.src = target.src;
    audioRef.current.currentTime = 0;
    if (wasPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }

  // Toggle Play / Pause
  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }

  // Thay doi am luong
  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Mini Player Pill */}
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-1.5 shadow-xs backdrop-blur transition-all",
          isPlaying ? "border-accent-strong/40 bg-accent-soft/30" : "hover:border-line/80",
        )}
      >
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc chill"}
          title={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc chill"}
        >
          {isPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" className="ml-0.5" />}
        </button>

        {/* Nút đổi kênh nhạc */}
        <div className="flex items-center gap-1 border-r border-line/60 pr-2">
          {TRACKS.map((t) => {
            const isSelected = t.id === currentTrack;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTrack(t.id)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer",
                  isSelected
                    ? "bg-accent-strong text-white font-semibold shadow-2xs"
                    : "text-muted hover:bg-surface hover:text-ink",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Điều khiển âm lượng */}
        <div className="flex items-center gap-1.5 pl-0.5">
          <button
            type="button"
            onClick={() => setShowControls((prev) => !prev)}
            className="flex h-6 w-6 items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
            aria-label="Âm lượng"
            title="Chỉnh âm lượng"
          >
            {volume === 0 ? (
              <SpeakerSimpleX size={15} />
            ) : volume < 0.5 ? (
              <SpeakerSimpleLow size={15} />
            ) : (
              <SpeakerSimpleHigh size={15} />
            )}
          </button>

          {showControls ? (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="h-1.5 w-16 accent-accent-strong cursor-pointer"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
