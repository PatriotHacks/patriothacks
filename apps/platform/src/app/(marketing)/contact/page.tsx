import type { Metadata } from "next";

import { Header } from "@/components/marketing/header";
import { CONTACT_LINKS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact | PatriotHacks",
  description: "Get in touch with PatriotHacks at George Mason University.",
  openGraph: {
    title: "Contact PatriotHacks",
    description: "Get in touch with PatriotHacks at George Mason University.",
    type: "website",
  },
};

const ICONS = {
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z",
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.87s0 3.6-.07 4.87c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.87.07s-3.6 0-4.87-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.22 2.2 12s0-3.6.07-4.87c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.46 2.21 8.84 2.2 12 2.2Zm0 1.8c-3.15 0-3.5 0-4.75.07-.9.04-1.38.19-1.7.31-.43.17-.73.37-1.05.69-.32.32-.52.62-.69 1.05-.12.32-.27.8-.31 1.7C3.42 8.5 3.42 8.85 3.42 12s0 3.5.07 4.75c.04.9.19 1.38.31 1.7.17.43.37.73.69 1.05.32.32.62.52 1.05.69.32.12.8.27 1.7.31 1.25.07 1.6.07 4.75.07s3.5 0 4.75-.07c.9-.04 1.38-.19 1.7-.31.43-.17.73-.37 1.05-.69.32-.32.52-.62.69-1.05.12-.32.27-.8.31-1.7.07-1.25.07-1.6.07-4.75s0-3.5-.07-4.75c-.04-.9-.19-1.38-.31-1.7a2.8 2.8 0 0 0-.69-1.05 2.8 2.8 0 0 0-1.05-.69c-.32-.12-.8-.27-1.7-.31C15.5 4 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 12 16.94 4.94 4.94 0 0 1 12 7.06Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.13-3.24a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z",
};

export default function ContactPage() {
  return (
    <div className="flex h-[100svh] flex-col bg-paper">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6">
        <h1 className="text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Contact Us
        </h1>
        <ul className="flex flex-col gap-6">
          {CONTACT_LINKS.map((c) => (
            <li key={c.href}>
              <a
                href={c.href}
                target={c.icon === "email" ? undefined : "_blank"}
                rel={c.icon === "email" ? undefined : "noopener noreferrer"}
                className="group flex items-center gap-4 text-lg text-slate transition hover:text-ink sm:text-xl"
              >
                {c.icon === "email" ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-6 shrink-0 text-ink"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
                    <path d="m3 6 9 7 9-7" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0 text-ink" fill="currentColor">
                    <path d={ICONS[c.icon]} />
                  </svg>
                )}
                <span className="underline decoration-line underline-offset-4 transition group-hover:decoration-ink">
                  {c.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
