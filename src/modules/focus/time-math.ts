// Pure time math cho session engine. Mọi tính toán từ timestamps, không đếm interval (SPEC D2).

export function computeRemainingSeconds(
  now: number,
  startedAtMs: number,
  plannedMs: number,
  distractionMs: number,
): number {
  const elapsed = now - startedAtMs - distractionMs;
  return Math.max(0, Math.ceil((plannedMs - elapsed) / 1000));
}

export function computeActualSeconds(
  now: number,
  startedAtMs: number,
  distractionMs: number,
): number {
  return Math.max(0, Math.round((now - startedAtMs - distractionMs) / 1000));
}
