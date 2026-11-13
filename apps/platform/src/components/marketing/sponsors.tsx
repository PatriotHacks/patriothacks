import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { CONTACT_EMAIL, SPONSORS } from "@/lib/site-config";

export function Sponsors() {
  return (
    <section className="flex w-full flex-col items-center gap-16">
      <h1 className="px-5 text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Our Sponsors and Supporters
      </h1>

      <LogoMarquee logos={SPONSORS} className="w-full max-w-4xl" />

      <p className="px-5 text-center text-slate">
        Interested in Supporting Us?{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-ink underline decoration-line underline-offset-4 transition hover:decoration-ink"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </section>
  );
}
