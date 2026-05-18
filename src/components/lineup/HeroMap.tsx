export function HeroMap() {
  return (
    <section
      data-section="hero-map"
      aria-labelledby="hero-map-heading"
      className="hidden min-[900px]:block border-b border-ink-300 bg-cream"
    >
      <div className="mx-auto max-w-6xl px-6 py-6">
        <h2
          id="hero-map-heading"
          className="text-xs font-semibold uppercase tracking-widest text-ink-500"
        >
          The three sites
        </h2>
        <p className="mt-1 text-xs text-ink-700">
          All three sites within a 10 minute walk.
        </p>

        <div className="mt-4 grid grid-cols-[65fr_35fr] gap-4">
          <div
            role="img"
            aria-label="Sitemap of Old Market Square, illustrated, with tappable pitches"
            className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-cream-50 p-4 text-center text-sm text-ink-500"
          >
            [OMS sitemap, illustrated, tappable pitches]
          </div>

          <div className="flex flex-col gap-4">
            <div
              role="img"
              aria-label="Satellite block showing Sussex Street Tram Stop, north-east of Old Market Square"
              className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-cream-50 p-4 text-center text-xs text-ink-500"
            >
              [Sussex St, north-east of the square]
            </div>
            <div
              role="img"
              aria-label="Satellite block showing Notts Central Library, south of Old Market Square"
              className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-cream-50 p-4 text-center text-xs text-ink-500"
            >
              [Library, south of the square]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
