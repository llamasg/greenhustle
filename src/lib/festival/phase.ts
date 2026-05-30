// Tiny clock helper. Festival-day phase logic has been removed: the page
// only ships for the day of the festival, so "live now" is always live.
export function getNow(): Date {
  return new Date();
}
