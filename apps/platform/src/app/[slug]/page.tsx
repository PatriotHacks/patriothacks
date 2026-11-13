import { AppShell } from "@patriothacks/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

import { optionalClaims } from "@/lib/auth";
import { withRls, withServiceRole } from "@/lib/db";
import { windowExplanation, windowState } from "@/lib/editability";
import { loadForm, loadSubmission } from "@/lib/form-data";

import { FillForm } from "./fill-form";
import { Header } from "@/components/marketing/header";

/** `[slug]` resolves against `forms.slug`, so `/volunteer` is data, not a route. */
export default async function FillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await withServiceRole((tx) => loadForm(tx, slug));
  if (loaded === null) notFound();

  const { form, definition } = loaded;
  const state = windowState(form);
  if (state === "after") notFound();
  const explanation = windowExplanation(form, state);

  const claims = await optionalClaims();
  const existing =
    claims === null
      ? null
      : await withRls(claims, (tx) => loadSubmission(tx, form.id, claims.sub));

  return (
    <AppShell>
      <Header />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{form.title}</h1>
          {form.description ? (
            <p className="text-sm text-muted-foreground">{form.description}</p>
          ) : null}
        </div>

        {existing !== null ? (
          <p role="status" className="rounded-md border bg-muted/40 p-3 text-sm">
            You have already submitted this form.{" "}
            <Link href={`/${slug}/review`} className="underline underline-offset-4">
              View your answers
            </Link>
          </p>
        ) : explanation !== null ? (
          <p role="status" className="rounded-md border bg-muted/40 p-3 text-sm">
            {explanation}
          </p>
        ) : (
          <FillForm
            slug={form.slug}
            definition={definition}
            initialEmail={typeof claims?.email === "string" ? claims.email : ""}
          />
        )}
      </div>
    </AppShell>
  );
}
