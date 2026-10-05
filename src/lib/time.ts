// Pure time helpers. Mọi "ngày/tuần" tính theo timezone của trình duyệt (SPEC OQ-4).

export type Daypart = "morning" | "afternoon" | "evening" | "night";

export const DAYPARTS: Daypart[] = ["morning", "afternoon", "evening", "night"];

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

// mm:ss cho đồng hồ đếm ngược
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

// Khóa ngày local dạng YYYY-MM-DD, dùng để gom nhóm thống kê
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

// Tuần bắt đầu Thứ 2 (ARCHITECTURE mục 9)
export function startOfWeekMonday(d: Date): Date {
  const r = startOfDay(d);
  const dow = (r.getDay() + 6) % 7; // Mon=0 .. Sun=6
  return addDays(r, -dow);
}

export function daypartOf(date: Date): Daypart {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

export function formatDateShort(d: Date, locale: "vi" | "en"): string {
  return d.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "short",
  });
}
