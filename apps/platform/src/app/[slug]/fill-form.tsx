"use client";

import {
  QuestionField,
  computeReachability,
  parseAnswerValue,
  resolveNextSection,
  validateAnswers,
  type AnswerValueByType,
  type FormDefinition,
  type Question,
  type QuestionType,
  type ValidationError,
} from "@patriothacks/form-engine";
import { Button, Input, Label } from "@patriothacks/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { submitForm } from "./actions";

function fieldValue(
  question: Question,
  raw: unknown,
): AnswerValueByType[QuestionType] | null {
  if (raw === undefined || raw === null) return null;
  const parsed = parseAnswerValue(question.type, raw);
  return parsed.success ? parsed.data : null;
}

function firstErrorPerQuestion(errors: ValidationError[]): Record<string, string> {
  const byQuestion: Record<string, string> = {};
  for (const error of errors) {
    if (byQuestion[error.questionId] === undefined) byQuestion[error.questionId] = error.message;
  }
  return byQuestion;
}

/**
 * Answers live only in this component until the one submit. Answers on a branch
 * the respondent switched away from are kept in state, so switching back
 * restores them, but only the reachable ones are sent.
 */
export function FillForm({
  slug,
  definition,
  initialEmail,
}: {
  slug: string;
  definition: FormDefinition;
  initialEmail: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [sectionId, setSectionId] = useState(() => definition.sections[0]?.id ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reachability = useMemo(
    () => computeReachability(definition, answers),
    [definition, answers],
  );
  const path = reachability.sections;
  const index = Math.max(
    0,
    path.findIndex((section) => section.id === sectionId),
  );
  const section = path[index];
  const atEnd = section
    ? resolveNextSection(definition, section.id, answers).kind === "submit"
    : true;

  function change(questionId: string, value: unknown) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setErrors((current) => {
      if (current[questionId] === undefined) return current;
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  }

  function goNext() {
    if (section === undefined) return;
    const next = resolveNextSection(definition, section.id, answers);
    if (next.kind === "section") setSectionId(next.sectionId);
  }

  function goBack() {
    const previous = path[index - 1];
    if (previous) setSectionId(previous.id);
  }

  function showErrors(list: ValidationError[]) {
    const byQuestion = firstErrorPerQuestion(list);
    setErrors(byQuestion);
    setNotice("Some answers need attention before this can be submitted.");
    const target = path.find((each) =>
      each.questions.some((question) => byQuestion[question.id] !== undefined),
    );
    if (target) setSectionId(target.id);
  }

  async function handleSubmit() {
    setNotice(null);
    setEmailError(null);

    const local = validateAnswers(reachability.questions, answers);
    if (!local.success) {
      showErrors(local.errors);
      return;
    }

    const reachable = Object.fromEntries(
      reachability.questions
        .filter((question) => answers[question.id] !== undefined)
        .map((question) => [question.id, answers[question.id]]),
    );

    setSubmitting(true);
    try {
      const result = await submitForm(slug, email, reachable);
      if (result.status === "submitted") {
        if (result.signedIn) {
          router.push(`/${slug}/review`);
          router.refresh();
        } else {
          setSubmitted(true);
        }
        return;
      }
      if (result.status === "invalid") showErrors(result.errors);
      else if (result.status === "invalid_email") setEmailError(result.message);
      else setNotice(result.message);
    } catch {
      setNotice("Your answers could not be submitted. Check your connection and try again.");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-md border bg-muted/40 p-4">
        <p className="font-medium">Thanks, your response was submitted.</p>
        <p className="text-sm text-muted-foreground">
          We will be in touch at {email.trim().toLowerCase()}.
        </p>
      </div>
    );
  }

  if (section === undefined) {
    return <p className="text-sm text-muted-foreground">This form has no sections yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="respondent-email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="respondent-email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError(null);
          }}
          aria-invalid={emailError !== null}
          aria-describedby={emailError !== null ? "respondent-email-error" : undefined}
        />
        {emailError !== null ? (
          <p id="respondent-email-error" role="alert" className="text-sm text-destructive">
            {emailError}
          </p>
        ) : null}
      </div>

      {path.length > 1 ? (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Section {index + 1} of {path.length}
          </span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((index + 1) / path.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      <section className="flex flex-col gap-6">
        {section.title || section.description ? (
          <div className="flex flex-col gap-1">
            {section.title ? <h2 className="text-lg font-medium">{section.title}</h2> : null}
            {section.description ? (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            ) : null}
          </div>
        ) : null}

        {section.questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            value={fieldValue(question, answers[question.id])}
            onChange={(value) => change(question.id, value)}
            error={errors[question.id] ?? null}
          />
        ))}
      </section>

      {notice !== null ? (
        <p role="alert" className="text-sm text-destructive">
          {notice}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-2 border-t bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        {index > 0 ? (
          <Button type="button" variant="outline" onClick={goBack}>
            Back
          </Button>
        ) : null}
        {atEnd ? (
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        ) : (
          <Button type="button" onClick={goNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
