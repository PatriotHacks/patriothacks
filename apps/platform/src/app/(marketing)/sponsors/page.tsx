import type { Metadata } from "next";

import { Header } from "@/components/marketing/header";
import { Sponsors } from "@/components/marketing/sponsors";

export const metadata: Metadata = {
  title: "Sponsors | PatriotHacks",
  description:
    "The companies and organizations that have sponsored PatriotHacks, George Mason University's hackathon.",
  openGraph: {
    title: "PatriotHacks Sponsors",
    description: "The sponsors that make PatriotHacks possible.",
    type: "website",
  },
};

export default function SponsorsPage() {
  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-paper">
      <Header />
      <main className="flex flex-1 items-center">
        <Sponsors />
      </main>
    </div>
  );
}
