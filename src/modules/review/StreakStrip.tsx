"use client";

import { useT } from "@/modules/i18n";
import { cn } from "@/lib/utils";

// Nguong tuyet doi (phut tich luy trong ngay, bat ke goal dat bao nhieu)
export const MEDAL_BRONZE_MIN = 30;
export const MEDAL_SILVER_MIN = 90;
export const MEDAL_GOLD_MIN = 120;

export type MedalTier = "gold" | "silver" | "bronze";

export function medalFor(minutes: number): MedalTier | null {
  if (minutes >= MEDAL_GOLD_MIN) return "gold";
  if (minutes >= MEDAL_SILVER_MIN) return "silver";
  if (minutes >= MEDAL_BRONZE_MIN) return "bronze";
  return null;
}

// Huy chuong Tinh the Da Quy (Palette B - Gemstone Glow)
export function MedalShield({ tier, size = 44 }: { tier: MedalTier; size?: number }) {
  if (tier === "gold") {
    // 120p: Hoàng Ngọc Rực Lửa (Solar Topaz Gem)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 52 52"
        role="img"
        aria-hidden="true"
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          <radialGradient id="gemTopaz" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#FACC15" />
            <stop offset="80%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#713F12" />
          </radialGradient>
        </defs>
        <circle cx="26" cy="26" r="23" fill="url(#gemTopaz)" stroke="#FACC15" strokeWidth="2" />
        <circle cx="26" cy="26" r="18" fill="none" stroke="#FEF9C3" strokeWidth="1.5" opacity="0.8" />
        <polygon
          points="26,17 28.5,23 35,23 30,27 32,33 26,29 20,33 22,27 17,23 23.5,23"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (tier === "silver") {
    // 90p: Ngọc Lục Bảo Xanh Mát (Emerald Gem)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 52 52"
        role="img"
        aria-hidden="true"
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          <radialGradient id="gemEmerald" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="40%" stopColor="#10B981" />
            <stop offset="80%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>
        </defs>
        <circle cx="26" cy="26" r="23" fill="url(#gemEmerald)" stroke="#10B981" strokeWidth="2" />
        <circle cx="26" cy="26" r="18" fill="none" stroke="#D1FAE5" strokeWidth="1.5" opacity="0.8" />
        <path d="M19.5 18 H32.5 L27.5 25 L32.5 32 H19.5 L24.5 25 Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 30p: Hổ Phách Lửa (Amber Gem)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      role="img"
      aria-hidden="true"
      className="shrink-0 drop-shadow-sm"
    >
      <defs>
        <radialGradient id="gemAmber" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="40%" stopColor="#F97316" />
          <stop offset="80%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#431407" />
        </radialGradient>
      </defs>
      <circle cx="26" cy="26" r="23" fill="url(#gemAmber)" stroke="#EA580C" strokeWidth="2" />
      <circle cx="26" cy="26" r="18" fill="none" stroke="#FFEDD5" strokeWidth="1.5" opacity="0.8" />
      <path
        d="M26 15 C26 15, 31 20, 31 25 C31 28, 28.5 30.5, 26 30.5 C23.5 30.5, 21 28, 21 25 C21 20, 26 15, 26 15 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// Vong ngay chua huy chuong: track xam + cung vang theo so phut (tron day = 120)
function DayRing({ minutes }: { minutes: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const frac = Math.min(1, Math.max(0, minutes / MEDAL_GOLD_MIN));
  return (
    <svg width={44} height={44} viewBox="0 0 44 44" role="img" aria-hidden="true" className="shrink-0">
      <circle cx={22} cy={22} r={r} fill="none" className="stroke-line" strokeWidth={3.5} />
      {frac > 0 ? (
        <circle
          cx={22}
          cy={22}
          r={r}
          fill="none"
          className="stroke-gold"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          transform="rotate(-90 22 22)"
        />
      ) : null}
    </svg>
  );
}

export function StreakStrip({
  perDay,
  dayLabels,
  todayIndex,
  unitLabel,
}: {
  perDay: number[];
  dayLabels: string[];
  todayIndex: number;
  unitLabel: string;
}) {
  const { t } = useT();
  const tierName: Record<MedalTier, string> = {
    gold: t.review.medal_gold,
    silver: t.review.medal_silver,
    bronze: t.review.medal_bronze,
  };

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between gap-2 px-4 pt-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          {t.review.streak_title}
        </h2>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {(["bronze", "silver", "gold"] as MedalTier[]).map((tier) => (
            <span key={tier} title={`${tierName[tier]}: ${tier === "gold" ? MEDAL_GOLD_MIN : tier === "silver" ? MEDAL_SILVER_MIN : MEDAL_BRONZE_MIN} ${unitLabel}`}>
              <MedalShield tier={tier} size={16} />
            </span>
          ))}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-7 divide-x divide-dashed divide-line border-t border-line/60">
        {perDay.map((minutes, i) => {
          const tier = medalFor(Math.round(minutes));
          const isToday = i === todayIndex;
          return (
            <div key={i} className="flex flex-col items-center gap-1 px-1 py-3">
              <span
                className={cn(
                  "text-[11px] font-medium",
                  isToday ? "font-semibold text-accent-strong" : "text-muted",
                )}
              >
                {dayLabels[i]}
              </span>
              <span
                role="img"
                aria-label={`${dayLabels[i]}: ${Math.round(minutes)} ${unitLabel}${tier ? `, ${t.review.streak_title} ${tierName[tier]}` : ""}`}
              >
                {tier ? <MedalShield tier={tier} /> : <DayRing minutes={minutes} />}
              </span>
              <span className="tnum text-xs text-muted">
                {Math.round(minutes)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
