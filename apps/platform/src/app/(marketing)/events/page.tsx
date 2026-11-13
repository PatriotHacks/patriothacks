import type { Metadata } from "next";

import { Header } from "@/components/marketing/header";
import { EVENTS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Events | PatriotHacks",
  description: "Upcoming PatriotHacks events at George Mason University.",
  openGraph: {
    title: "PatriotHacks Events",
    description: "Upcoming PatriotHacks events at George Mason University.",
    type: "website",
  },
};

export default function EventsPage() {
  return (
    <>
      <Header />
      <main className="bg-paper px-12 py-12 sm:px-36 sm:py-16 lg:px-56">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Events</h1>
          <ul className="mt-12 border-t border-line">
            {EVENTS.map((e) => (
              <li key={e.href} className="border-b border-line">
                <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6 py-6"
              >
                  <span className="text-xl font-normal tracking-tight text-ink sm:text-2xl">
                    {e.title}
                  </span>
                  <span className="flex items-center gap-6 sm:gap-10">
                    <span className="text-slate tabular-nums">{e.dates}</span>
                    <span className="inline-flex items-center gap-2 font-semibold text-mason">
                      Sign up
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
      </main>
    </>
  );
}
