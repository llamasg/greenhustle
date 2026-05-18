export type FestivalPhase =
  | "pre-launch"
  | "lineup-live"
  | "festival-day"
  | "post-festival";

export const FESTIVAL_DATE = new Date("2026-05-30T11:00:00+01:00");
export const FESTIVAL_END = new Date("2026-05-30T18:00:00+01:00");
const NOW = new Date("2026-05-16T14:00:00+01:00");

const LINEUP_LIVE_DAYS_BEFORE = 60;

export function getNow(): Date {
  return new Date(NOW.getTime());
}

export function getCurrentPhase(): FestivalPhase {
  if (NOW > FESTIVAL_END) return "post-festival";
  if (NOW >= FESTIVAL_DATE && NOW <= FESTIVAL_END) return "festival-day";

  const lineupLiveDate = new Date(FESTIVAL_DATE);
  lineupLiveDate.setDate(lineupLiveDate.getDate() - LINEUP_LIVE_DAYS_BEFORE);

  if (NOW >= lineupLiveDate) return "lineup-live";
  return "pre-launch";
}
