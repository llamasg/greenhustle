import Link from "next/link";
import { FOOTER } from "@/lib/festival/content";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function SiteFooter() {
  return (
    <footer
      data-section="footer"
      className="border-t border-black"
    >
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <section
            aria-labelledby="footer-beyond-heading"
            className="border border-black p-4"
          >
            <h2
              id="footer-beyond-heading"
              className="text-sm font-semibold uppercase tracking-wide"
            >
              {FOOTER.beyond.title}
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {FOOTER.beyond.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`underline underline-offset-2 ${focusRing}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="footer-contact-heading"
            className="border border-black p-4"
          >
            <h2
              id="footer-contact-heading"
              className="text-sm font-semibold uppercase tracking-wide"
            >
              {FOOTER.contact.title}
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <a
                  href={`mailto:${FOOTER.contact.email}`}
                  className={`underline underline-offset-2 ${focusRing}`}
                >
                  {FOOTER.contact.email}
                </a>
              </li>
              <li className="flex flex-wrap gap-x-3 gap-y-1">
                {FOOTER.contact.socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className={`underline underline-offset-2 ${focusRing}`}
                  >
                    {social.label}
                  </Link>
                ))}
              </li>
              <li>
                <a
                  href={FOOTER.contact.accessibilityForm.href}
                  className={`underline underline-offset-2 ${focusRing}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {FOOTER.contact.accessibilityForm.label}
                </a>
              </li>
            </ul>
          </section>

          <section
            aria-labelledby="footer-newsletter-heading"
            className="border border-black p-4"
          >
            <h2
              id="footer-newsletter-heading"
              className="text-sm font-semibold uppercase tracking-wide"
            >
              {FOOTER.newsletter.title}
            </h2>
            <form
              action="#"
              method="post"
              className="mt-3 flex flex-col gap-2"
              aria-describedby="newsletter-help"
            >
              <label
                htmlFor="newsletter-email"
                className="text-sm"
              >
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder={FOOTER.newsletter.placeholder}
                className={`min-h-[44px] w-full border border-black bg-white px-2 py-2 text-sm ${focusRing}`}
              />
              <button
                type="submit"
                className={`min-h-[44px] border border-black bg-white px-3 py-2 text-sm font-medium hover:bg-gray-100 ${focusRing}`}
              >
                {FOOTER.newsletter.submit}
              </button>
              <p id="newsletter-help" className="text-xs text-gray-700">
                Occasional updates about the festival.
              </p>
            </form>
          </section>
        </div>

        <p className="mt-6 border-t border-black pt-4 text-xs text-gray-700">
          {FOOTER.legal}
        </p>
      </div>
    </footer>
  );
}
