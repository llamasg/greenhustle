import Link from "next/link";
import { SAVE_THE_DATE } from "@/lib/festival/content";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function SaveTheDate() {
  return (
    <section
      id="save-the-date"
      data-section="save-the-date"
      className="border border-black"
      aria-labelledby="save-the-date-heading"
    >
      <div className="mx-auto max-w-3xl px-4 py-8 text-center text-sm text-gray-800">
        <h2
          id="save-the-date-heading"
          className="sr-only"
        >
          Save the date
        </h2>
        <p>{SAVE_THE_DATE.date}</p>
        <p className="mt-1">{SAVE_THE_DATE.locations}</p>
        <p className="mt-2">
          <Link
            href={SAVE_THE_DATE.calendarLink}
            className={`underline underline-offset-2 ${focusRing}`}
          >
            Add to calendar
          </Link>
        </p>
      </div>
    </section>
  );
}
