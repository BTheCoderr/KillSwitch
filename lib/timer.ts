export function getRemainingSeconds(
  seconds: number,
  startedAt: string | null | undefined,
  running: boolean,
  nowMs = Date.now(),
) {
  const base = Math.max(0, Math.trunc(Number.isFinite(seconds) ? seconds : 0));
  if (!running || !startedAt) return base;

  const startedMs = Date.parse(startedAt);
  if (!Number.isFinite(startedMs)) return base;

  const elapsed = Math.max(0, Math.floor((nowMs - startedMs) / 1000));
  return Math.max(0, base - elapsed);
}
