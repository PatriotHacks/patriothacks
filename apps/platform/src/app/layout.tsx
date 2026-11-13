import { ThemeProvider } from "@patriothacks/ui";
import type { Metadata, Viewport } from "next";
import { Figtree, Geist } from "next/font/google";

import "./globals.css";

/** Same typeface, same variable, same reasoning as the admin console. */
const sans = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui",
});

/** The marketing pages' typeface, applied by the `.marketing` wrapper. */
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "PatriotHacks",
  description: "Apply to PatriotHacks.",
  icons: { icon: { url: "/favicon.png", type: "image/png", sizes: "512x512" } },
};

/** Only the theme colour — Next already emits the right `width`/`initial-scale`. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
