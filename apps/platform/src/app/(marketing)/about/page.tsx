import type { Metadata } from "next";

import { Header } from "@/components/marketing/header";

export const metadata: Metadata = {
  title: "About | PatriotHacks",
  description: "About PatriotHacks, George Mason University's hackathon.",
  openGraph: {
    title: "About PatriotHacks",
    description: "About PatriotHacks, George Mason University's hackathon.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-paper px-12 py-12 sm:px-36 sm:py-16 lg:px-56">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">About Us</h1>
        <div className="mt-12 max-w-3xl space-y-6 border-t border-line pt-12 text-lg text-slate sm:text-xl">
          <p>
            PatriotHacks is a hackathon run by a registered student organization at George Mason
            University. We bring in 1000 students to build and innovate.
          </p>
          <p>
            Participants come to learn new tools, work in teams and turn ideas into working projects.
            Whether it is someone&apos;s first hackathon or their tenth, the goal is the same: build
            something real.
          </p>
          <p>
            PatriotHacks is supported by prominent sponsors including Microsoft, Salesforce, AWS and
            Palantir, who help make the event possible.
          </p>
        </div>
      </main>
    </>
  );
}
