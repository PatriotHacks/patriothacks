-- Forms become anonymous and one-shot. A submission is identified by the email
-- the respondent typed, unique per form; `user_id` is only set when they were
-- signed in. Drafts no longer exist: the platform inserts a submission and its
-- answers together, on the service-role connection, so every applicant write
-- policy goes. Existing drafts are kept so admins can still see them.
ALTER TABLE "submissions" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "status" SET DEFAULT 'submitted';--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "respondent_email" text;--> statement-breakpoint
UPDATE "submissions" s SET "respondent_email" = lower(btrim(p."email")) FROM "profiles" p WHERE p."id" = s."user_id";--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "respondent_email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_form_id_respondent_email_unique" UNIQUE("form_id","respondent_email");--> statement-breakpoint
DROP POLICY "answers_insert_own" ON "answers" CASCADE;--> statement-breakpoint
DROP POLICY "answers_update_own" ON "answers" CASCADE;--> statement-breakpoint
DROP POLICY "answers_delete_own" ON "answers" CASCADE;--> statement-breakpoint
DROP POLICY "submissions_insert_own" ON "submissions" CASCADE;--> statement-breakpoint
DROP POLICY "submissions_update_own" ON "submissions" CASCADE;
