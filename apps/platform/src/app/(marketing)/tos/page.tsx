import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | PatriotHacks",
  description: "The terms that govern your use of the PatriotHacks website and events.",
  openGraph: {
    title: "Terms of Service | PatriotHacks",
    description: "The terms that govern your use of the PatriotHacks website and events.",
    type: "website",
  },
};

export default function TosPage() {
  return <LegalPage file="TERMS.md" />;
}
