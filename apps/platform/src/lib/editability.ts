import type { Form, Submission } from "@patriothacks/database";

export type WindowState = "before" | "open" | "after";

/** The `opens_at`/`closes_at` window, checked by the page and again on submit. */
export function windowState(form: Form, now: Date = new Date()): WindowState {
  if (form.opensAt !== null && now < form.opensAt) return "before";
  if (form.closesAt !== null && now > form.closesAt) return "after";
  return "open";
}

export function windowExplanation(form: Form, state: WindowState): string | null {
  if (state === "before") {
    return form.opensAt === null
      ? "This form is not open yet."
      : `This form opens on ${formatDate(form.opensAt)}.`;
  }
  if (state === "after") {
    return form.closesAt === null
      ? "This form is closed."
      : `This form closed on ${formatDate(form.closesAt)}.`;
  }
  return null;
}

/**
 * Stored UTC, rendered in Eastern — the event's timezone. `timeZoneName` names
 * the offset actually in force rather than assuming one, and cannot be combined
 * with `dateStyle`/`timeStyle`, hence the explicit components.
 */
export function formatDate(value: Date): string {
  return value.toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export const SUBMISSION_STATUS_LABELS: Record<Submission["status"], string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted",
  waitlisted: "Waitlisted",
  rejected: "Not accepted",
  withdrawn: "Withdrawn",
};
