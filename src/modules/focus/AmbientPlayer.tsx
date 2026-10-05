"use client";

import { Play, Pause, SpeakerSimpleHigh, SpeakerSimpleLow, SpeakerSimpleX } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAmbientStore, TRACKS, type SoundTrack } from "./ambient-store";

export function AmbientPlayer() {
  const isPlaying = useAmbientStore((s) => s.isPlaying);
  const currentTrack = useAmbientStore((s) => s.currentTrack);
  const volume = useAmbientStore((s) => s.volume);
  const showControls = useAmbientStore((s) => s.showControls);

  const togglePlay = useAmbientStore((s) => s.togglePlay);
  const setTrack = useAmbientStore((s) => s.setTrack);
  const setVolume = useAmbientStore((s) => s.setVolume);
  const setShowControls = useAmbientStore((s) => s.setShowControls);

  function handleSelectTrack(trackId: SoundTrack) {
    setTrack(trackId);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(parseFloat(e.target.value));
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
