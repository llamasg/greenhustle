import Link from "next/link";
import { PRACTICAL, type PracticalBlock } from "@/lib/festival/content";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function PracticalStrip({
  blocks = PRACTICAL,
}: {
  blocks?: PracticalBlock[];
}) {
  return (
    <section
      id="practical-info"
      data-section="practical"
      className="border border-black"
      aria-labelledby="practical-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2
          id="practical-heading"
          className="text-2xl font-semibold sm:text-3xl"
        >
          How to find your day
        </h2>
        <p className="mt-2 text-base text-gray-800">
          The practical stuff in 4 lines
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {blocks.map((block) => (
            <li
              key={block.title}
              className="flex flex-col gap-2 border border-black p-4"
            >
              <h3 className="text-base font-semibold">{block.title}</h3>
              <p className="text-sm text-gray-800">{block.description}</p>
              {block.href ? (
                <p className="mt-auto pt-2">
                  <Link
                    href={block.href}
                    className={`text-sm underline underline-offset-2 ${focusRing}`}
                  >
                    More on {block.title.toLowerCase()}
                  </Link>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
