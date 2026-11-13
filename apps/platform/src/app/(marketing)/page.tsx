import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/marketing/header";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import {
  HANDS_LEFT,
  HANDS_LEFT_COLS,
  HANDS_LEFT_TIP,
  HANDS_RIGHT,
  HANDS_RIGHT_COLS,
  HANDS_RIGHT_TIP,
} from "@/components/marketing/hands-art";
import { Shimmer } from "@/components/marketing/shimmer";
import { HOME_LOGOS, PAGE_LINKS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "PatriotHacks - GMU's Premier Hackathon Organization",
  description: "PatriotHacks — building the future of tech at George Mason University.",
  openGraph: {
    title: "PatriotHacks",
    description: "Building the future of tech at George Mason University.",
    type: "website",
  },
};

const handStyle = (cols: number, tip: number) => ({
  width: `${cols}ch`,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: `max(calc((100vw - 18rem) / ${(HANDS_LEFT_COLS + HANDS_RIGHT_COLS) * 0.6}), 2.6px)`,
  transform: `translateY(${(0.5 - tip) * 100}%)`,
});

const toHtml = (art: string) => art.replace(/\d/g, "<span>$&</span>");

const NAV_LINKS = [...PAGE_LINKS, { href: "/contact", label: "Contact" }];

export default function HomePage() {
  return (
    <div className="relative flex h-[100svh] flex-col overflow-hidden bg-paper">
      <Header />

      <Shimmer className="flex flex-1 items-center justify-center overflow-hidden">
        <pre
          aria-hidden
          className="m-0 shrink-0 leading-none text-ink select-none"
          style={handStyle(HANDS_LEFT_COLS, HANDS_LEFT_TIP)}
          dangerouslySetInnerHTML={{ __html: toHtml(HANDS_LEFT) }}
        />
        <h1 className="shrink-0 whitespace-nowrap px-3 font-display text-base font-normal tracking-tight text-ink sm:px-4 sm:text-xl">
          building the future of tech.
        </h1>
        <pre
          aria-hidden
          className="m-0 shrink-0 leading-none text-ink select-none"
          style={handStyle(HANDS_RIGHT_COLS, HANDS_RIGHT_TIP)}
          dangerouslySetInnerHTML={{ __html: toHtml(HANDS_RIGHT) }}
        />
      </Shimmer>

      <nav aria-label="Pages" className="absolute right-5 bottom-4 z-10 sm:right-8">
        <LogoMarquee logos={HOME_LOGOS} size={17} secondsPerLogo={4.5} className="mb-4 w-0 min-w-full" />
        <ul className="flex items-center gap-5 border-t border-ink pt-5 sm:gap-7">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-lg font-medium text-slate transition hover:text-ink sm:text-xl"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
