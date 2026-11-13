"use server";

import { answers as answersTable, submissions } from "@patriothacks/database";
import {
  computeReachability,
  isEmptyAnswerValue,
  validateAnswers,
  type ValidationError,
} from "@patriothacks/form-engine";
import { revalidatePath } from "next/cache";

import { optionalClaims } from "@/lib/auth";
import { withServiceRole } from "@/lib/db";
import { windowExplanation, windowState } from "@/lib/editability";
import { loadForm } from "@/lib/form-data";

export type SubmitResult =
  | { status: "submitted"; signedIn: boolean }
  | { status: "invalid"; errors: ValidationError[] }
  | { status: "invalid_email"; message: string }
  | { status: "error"; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DUPLICATE_EMAIL_MESSAGE =
  "This form has already been submitted with this email. If you think that is a mistake, reach out to us.";

function uniqueViolation(error: unknown): string | null {
  for (let current = error; typeof current === "object" && current !== null; ) {
    if ("code" in current && current.code === "23505") {
      return "constraint" in current && typeof current.constraint === "string"
        ? current.constraint
        : "";
    }
    current = "cause" in current ? current.cause : null;
  }
  return null;
}

/**
 * One-shot submit. Nothing the browser sends is trusted: the form is reloaded,
 * the window rechecked, reachability recomputed from the submitted answers, and
 * only answers on the respondent's own path are validated and stored. The
 * submission and its answers commit together or not at all.
 */
export async function submitForm(
  slug: string,
  rawEmail: string,
  values: Record<string, unknown>,
): Promise<SubmitResult> {
  const email = rawEmail.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { status: "invalid_email", message: "Enter a valid email address." };
  }

  const claims = await optionalClaims();
  const userId = claims?.sub ?? null;

  let result: SubmitResult;
  try {
    result = await withServiceRole(async (tx): Promise<SubmitResult> => {
      const loaded = await loadForm(tx, slug);
      if (loaded === null) return { status: "error", message: "That form is not available." };

      const { form, definition } = loaded;
      const state = windowState(form);
      if (state !== "open") {
        return {
          status: "error",
          message: windowExplanation(form, state) ?? "This form is not accepting submissions.",
        };
      }

      const reachable = computeReachability(definition, values);
      const validation = validateAnswers(reachable.questions, values);
      if (!validation.success) return { status: "invalid", errors: validation.errors };

      const now = new Date();
      const [submission] = await tx
        .insert(submissions)
        .values({
          formId: form.id,
          userId,
          respondentEmail: email,
          status: "submitted",
          submittedAt: now,
        })
        .returning({ id: submissions.id });
      if (!submission) throw new Error("Submission insert returned no row");

      const rows = reachable.questions
        .filter((question) => !isEmptyAnswerValue(values[question.id]))
        .map((question) => ({
          submissionId: submission.id,
          questionId: question.id,
          value: values[question.id],
        }));
      if (rows.length > 0) await tx.insert(answersTable).values(rows);

      return { status: "submitted", signedIn: userId !== null };
    });
  } catch (error) {
    const constraint = uniqueViolation(error);
    if (constraint === "submissions_form_id_respondent_email_unique") {
      return { status: "invalid_email", message: DUPLICATE_EMAIL_MESSAGE };
    }
    if (constraint === "submissions_form_id_user_id_unique") {
      return { status: "error", message: "You have already submitted this form." };
    }
    throw error;
  }

  if (result.status === "submitted" && userId !== null) {
    revalidatePath("/submissions");
    revalidatePath(`/${slug}/review`);
  }
  return result;
}
