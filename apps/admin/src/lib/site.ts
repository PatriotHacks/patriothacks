/** The public site that serves every form at `/[slug]`. Configured, not derived from the request. */
export function formUrl(slug: string): string {
  const base = process.env.SITE_URL;
  if (!base) throw new Error("SITE_URL is not set");
  return `${base.replace(/\/+$/, "")}/${slug}`;
}
