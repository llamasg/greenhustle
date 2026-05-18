import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Green Hustle Festival 2026",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">About Green Hustle</h1>

      <section id="accessibility" className="mt-8 border border-black p-4">
        <h2 className="text-2xl font-semibold">Accessibility</h2>
        <p className="mt-2 text-sm text-gray-700">
          Placeholder. Step-free access, BSL on request, quiet spaces, access
          team on the day.
        </p>
      </section>

      <section id="getting-there" className="mt-6 border border-black p-4">
        <h2 className="text-2xl font-semibold">Getting there</h2>
        <p className="mt-2 text-sm text-gray-700">
          Placeholder. Old Market Sq, NG1 2BY. Tram stops opposite. Parking
          nearby.
        </p>
      </section>
    </main>
  );
}
