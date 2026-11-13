import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | PatriotHacks",
  description: "How PatriotHacks collects, uses and protects your information.",
  openGraph: {
    title: "Privacy Policy | PatriotHacks",
    description: "How PatriotHacks collects, uses and protects your information.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <LegalPage file="PRIVACY.md" />;
}
