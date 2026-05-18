import Link from "next/link";
import { WHY_EXISTS } from "@/lib/festival/content";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function WhyExistsSection() {
  return (
    <section
      data-section="why"
      className="border border-black"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h2
          id="why-heading"
          className="text-2xl font-semibold sm:text-3xl"
        >
          Why this festival exists
        </h2>
        <p className="mt-4 text-base text-gray-900">{WHY_EXISTS.body}</p>

        <figure className="mt-6 border border-black p-4">
          <blockquote className="text-base italic text-gray-900">
            &ldquo;{WHY_EXISTS.quote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-2 text-sm text-gray-700">
            {WHY_EXISTS.quote.attribution}
          </figcaption>
        </figure>

        <p className="mt-6">
          <Link
            href={WHY_EXISTS.link.href}
            className={`text-sm underline underline-offset-2 ${focusRing}`}
          >
            {WHY_EXISTS.link.label} &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
