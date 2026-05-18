export type TimedStatus = "live" | "next" | "past" | "upcoming";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

const NEXT_WINDOW_MINUTES = 30;

export function statusFor(
  startTime: string,
  endTime: string,
  nowMinutes: number | null
): TimedStatus {
  if (nowMinutes === null) return "upcoming";
  const s = toMinutes(startTime);
  const e = toMinutes(endTime);
  if (nowMinutes >= s && nowMinutes < e) return "live";
  if (nowMinutes >= e) return "past";
  if (s - nowMinutes <= NEXT_WINDOW_MINUTES) return "next";
  return "upcoming";
}
