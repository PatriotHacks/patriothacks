-- Volunteer and judge rows were copied into submissions by 0013. RSVP and the
-- per-form edit policy are gone: submissions are one-shot. The stored
-- rsvp_confirmed template goes with them, and the seeded RSVP sentence leaves
-- decision_accepted. Any other {{rsvp_url}} an organizer wrote would make every
-- acceptance email throw, so it stops the migration instead.
DROP POLICY "Anyone can submit a judge application" ON "judges" CASCADE;--> statement-breakpoint
DROP POLICY "judges_select_admin" ON "judges" CASCADE;--> statement-breakpoint
DROP TABLE "judges" CASCADE;--> statement-breakpoint
DROP POLICY "Anyone can submit a volunteer application" ON "volunteers" CASCADE;--> statement-breakpoint
DROP POLICY "volunteers_select_admin" ON "volunteers" CASCADE;--> statement-breakpoint
DROP TABLE "volunteers" CASCADE;--> statement-breakpoint
ALTER TABLE "forms" DROP COLUMN "edit_policy";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN "editable_after_submit";--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN "rsvp_status";--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN "rsvp_at";--> statement-breakpoint
DROP TYPE "public"."form_edit_policy";--> statement-breakpoint
DROP TYPE "public"."rsvp_status";--> statement-breakpoint
DELETE FROM "email_templates" WHERE "key" = 'rsvp_confirmed';--> statement-breakpoint
UPDATE "email_templates" SET
  "body_html" = regexp_replace("body_html", '\s*RSVP at \{\{\s*rsvp_url\s*\}\}\.?', '', 'gi'),
  "body_text" = regexp_replace("body_text", '\s*RSVP at \{\{\s*rsvp_url\s*\}\}\.?', '', 'gi'),
  "subject" = regexp_replace("subject", '\s*RSVP at \{\{\s*rsvp_url\s*\}\}\.?', '', 'gi')
WHERE "key" = 'decision_accepted';--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "email_templates"
    WHERE ("subject" || "body_html" || "body_text") ~* '\{\{\s*rsvp_url\s*\}\}'
  ) THEN
    RAISE EXCEPTION 'email_templates still reference {{rsvp_url}}; remove it from those templates and re-run';
  END IF;
END
$$;
