import Image from "next/image";

const MAIN_SITE_URL = "https://greenhustle.co.uk";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy";

export function SiteNav() {
  return (
    <header
      data-section="site-nav"
      className="sticky top-0 z-40 border-b border-cream-100 bg-cream/95 backdrop-blur"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 md:px-6 md:py-3"
      >
        <a
          href={MAIN_SITE_URL}
          className={`flex items-center gap-2 ${focusRing}`}
          aria-label="Green Hustle, back to main site"
        >
          <Image
            src="/images/vectors/gh25-logo-03.svg"
            alt=""
            aria-hidden="true"
            width={120}
            height={82}
            className="h-10 w-auto md:h-12"
            priority
          />
          <span className="sr-only">Green Hustle</span>
        </a>
      </nav>
    </header>
  );
}
