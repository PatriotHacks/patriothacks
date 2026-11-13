import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source, not a build.
  transpilePackages: [
    "@patriothacks/database",
    "@patriothacks/emails",
    "@patriothacks/form-engine",
    "@patriothacks/ui",
  ],
  // `pg` resolves its driver at runtime; bundling it breaks that.
  serverExternalPackages: ["pg"],
  // Sources match case-insensitively, so `/Apply` lands here too.
  async redirects() {
    return [
      { source: "/sponsor", destination: "/sponsors", permanent: true },
      { source: "/hackathon", destination: "https://patriothackfest.com", permanent: false },
    ];
  },
  async rewrites() {
    return [{ source: "/book", destination: "/book.html" }];
  },
};

export default nextConfig;
