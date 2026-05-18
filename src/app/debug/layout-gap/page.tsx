export default function DebugLayoutGapPage() {
  // Mirrors the lineup page wrapper chain so we can see *which* level
  // introduces left/right/bottom whitespace on mobile. Each level uses a
  // different background colour. The classes are copied verbatim from
  // the production hierarchy so the layout behaviour matches.
  return (
    <main className="min-h-screen bg-orange-300">
      <p className="bg-orange-100 p-1 font-mono text-xs">
        MAIN (orange) — what shows where nothing else covers it
      </p>

      {/* page wrapper — same classes as src/app/lineup/page.tsx */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 bg-pink-300 px-4 py-4 md:gap-5 md:px-6 md:py-6">
        <p className="font-mono text-xs">
          PAGE WRAPPER (pink) — px-4 mobile / px-6 desktop
        </p>

        {/* LineupView sticky root — same classes as src/components/lineup/LineupView.tsx:186 */}
        <div className="sticky top-14 z-30 flex h-[calc(100vh-3.5rem)] min-w-0 flex-col gap-4 bg-purple-300 md:h-[calc(100vh-5rem)] md:gap-5">
          <p className="p-1 font-mono text-xs">LINEUPVIEW ROOT (purple)</p>

          {/* feed section — same classes as src/components/lineup/LineupView.tsx:206 */}
          <section className="-mx-4 flex min-h-0 min-w-0 flex-1 overflow-hidden bg-blue-300 md:mx-0">
            {/* scroll inner — same classes as src/components/lineup/LineupView.tsx:207 */}
            <div className="h-full w-full overflow-y-auto bg-yellow-300 px-2 py-4 md:px-6 md:py-8">
              <p className="font-mono text-xs">
                SCROLL INNER (yellow) — px-2 mobile / px-6 desktop
              </p>
              <p className="font-mono text-xs">
                SECTION (blue, -mx-4 mobile) — should peek out at left and
                right edges of the yellow zone
              </p>
              <ul className="flex flex-col gap-4 pt-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <li key={i}>
                    <div className="rounded-2xl bg-green-300 p-4">
                      <p className="font-mono text-xs">
                        CARD {i + 1} (green) — should hit yellow&apos;s
                        content-area edges
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
