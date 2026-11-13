/** Top-level paths the site owns, so a form slug can never shadow one. */
export const RESERVED_SLUGS = [
  "hackathon",
  "sponsors",
  "sponsor",
  "events",
  "contact",
  "privacy",
  "tos",
  "book",
  "login",
  "auth",
  "submissions",
  "apply",
  "api",
  "_next",
] as const;

export function isReservedSlug(slug: string): boolean {
  return (RESERVED_SLUGS as readonly string[]).includes(slug.toLowerCase());
}
