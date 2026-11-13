-- The website's volunteer and judge forms become ordinary builder forms with
-- slugs `volunteer` and `judge`, and every row already collected in the
-- `volunteers` / `judges` tables becomes a submission of the matching form.
-- The email column becomes `respondent_email`; it is not a question. Each
-- acknowledgement is a required one-option checkboxes question whose answer is
-- ["agree"]. Every id is fixed, and each existing row keeps its id as the
-- submission id, so re-running this inserts nothing. The tables themselves are
-- dropped by the next migration.
--> statement-breakpoint
INSERT INTO "forms" ("id", "slug", "title", "description", "status", "visibility", "published_at")
VALUES ('00000000-0000-4000-a000-000000000001', 'volunteer', 'Volunteer at PatriotHacks', 'Volunteers keep PatriotHacks running — checking hackers in, handing out meals, staffing the help desk, and making sure everyone has what they need. It''s the best seat in the house if you want to see how a hackathon actually comes together. Fill this out and we''ll reach out as the event gets closer with shifts and details.', 'published', 'public', now())
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "form_sections" ("id", "form_id", "title", "position", "next_action")
VALUES ('00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', NULL, 0, 'submit')
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "questions" ("id", "section_id", "form_id", "type", "label", "help_text", "position", "required", "config")
VALUES
  ('00000000-0000-4000-a001-000000000001', '00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'short_answer', 'What is your name?', NULL, 0, true, '{"maxLength": 120}'::jsonb),
  ('00000000-0000-4000-a001-000000000002', '00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'multiple_choice', 'Are you a George Mason University alum?', NULL, 1, true, NULL),
  ('00000000-0000-4000-a001-000000000003', '00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'paragraph', 'Why do you want to volunteer?', NULL, 2, true, '{"maxLength": 2000}'::jsonb),
  ('00000000-0000-4000-a001-000000000004', '00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'checkboxes', 'I understand that if selected, I am responsible for arranging my own transportation to and from the event.', NULL, 3, true, NULL),
  ('00000000-0000-4000-a001-000000000005', '00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'checkboxes', 'I understand that if selected, I am expected to be present for the full duration of my assigned shift.', NULL, 4, true, NULL),
  ('00000000-0000-4000-a001-000000000006', '00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'checkboxes', 'I agree to abide by the MLH Code of Conduct.', 'Read it here: https://static.mlh.io/docs/mlh-code-of-conduct.pdf', 5, true, NULL),
  ('00000000-0000-4000-a001-000000000007', '00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'checkboxes', 'I consent to being contacted at this email address about PatriotHacks.', NULL, 6, true, NULL)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "question_options" ("id", "question_id", "kind", "label", "value", "position")
VALUES
  ('00000000-0000-4000-b001-000000000001', '00000000-0000-4000-a001-000000000002', 'choice', 'Yes', 'yes', 0),
  ('00000000-0000-4000-b001-000000000002', '00000000-0000-4000-a001-000000000002', 'choice', 'No', 'no', 1),
  ('00000000-0000-4000-b001-000000000003', '00000000-0000-4000-a001-000000000004', 'choice', 'I agree', 'agree', 0),
  ('00000000-0000-4000-b001-000000000004', '00000000-0000-4000-a001-000000000005', 'choice', 'I agree', 'agree', 0),
  ('00000000-0000-4000-b001-000000000005', '00000000-0000-4000-a001-000000000006', 'choice', 'I agree', 'agree', 0),
  ('00000000-0000-4000-b001-000000000006', '00000000-0000-4000-a001-000000000007', 'choice', 'I agree', 'agree', 0)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.volunteers') IS NOT NULL THEN
    INSERT INTO "submissions" ("id", "form_id", "user_id", "respondent_email", "status", "submitted_at", "created_at", "updated_at")
    SELECT r.id, '00000000-0000-4000-a000-000000000001', NULL, lower(btrim(r.email)), 'submitted', r.created_at, r.created_at, r.created_at
    FROM public.volunteers r
    ON CONFLICT DO NOTHING;

    INSERT INTO "answers" ("submission_id", "question_id", "value", "updated_at")
    SELECT r.id, a.question_id, a.value, r.created_at
    FROM public.volunteers r
    CROSS JOIN LATERAL (VALUES
      ('00000000-0000-4000-a001-000000000001'::uuid, to_jsonb(r.name)),
      ('00000000-0000-4000-a001-000000000002'::uuid, to_jsonb(CASE WHEN r.is_gmu_alum THEN 'yes' ELSE 'no' END)),
      ('00000000-0000-4000-a001-000000000003'::uuid, to_jsonb(r.reason)),
      ('00000000-0000-4000-a001-000000000004'::uuid, '["agree"]'::jsonb),
      ('00000000-0000-4000-a001-000000000005'::uuid, '["agree"]'::jsonb),
      ('00000000-0000-4000-a001-000000000006'::uuid, '["agree"]'::jsonb),
      ('00000000-0000-4000-a001-000000000007'::uuid, '["agree"]'::jsonb)
    ) AS a(question_id, value)
    WHERE EXISTS (SELECT 1 FROM "submissions" s WHERE s.id = r.id)
    ON CONFLICT DO NOTHING;
  END IF;
END
$$;
--> statement-breakpoint
INSERT INTO "forms" ("id", "slug", "title", "description", "status", "visibility", "published_at")
VALUES ('00000000-0000-4000-a000-000000000002', 'judge', 'Judge at PatriotHacks', 'Judges spend a few hours at the end of the event meeting teams, hearing demos, and picking the projects that stand out. We''re looking for engineers, designers, founders, researchers, and industry folks of every stripe — you do not need to be an expert in every technology on the table. Fill this out and we''ll follow up with the judging schedule.', 'published', 'public', now())
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "form_sections" ("id", "form_id", "title", "position", "next_action")
VALUES ('00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', NULL, 0, 'submit')
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "questions" ("id", "section_id", "form_id", "type", "label", "help_text", "position", "required", "config")
VALUES
  ('00000000-0000-4000-a002-000000000001', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'short_answer', 'What is your name?', NULL, 0, true, '{"maxLength": 120}'::jsonb),
  ('00000000-0000-4000-a002-000000000002', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'multiple_choice', 'Are you a George Mason University alum?', NULL, 1, true, NULL),
  ('00000000-0000-4000-a002-000000000003', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'short_answer', 'What company or organization are you with?', NULL, 2, true, '{"maxLength": 160}'::jsonb),
  ('00000000-0000-4000-a002-000000000004', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'short_answer', 'What is your role or job title?', NULL, 3, true, '{"maxLength": 160}'::jsonb),
  ('00000000-0000-4000-a002-000000000005', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'short_answer', 'What is your area of expertise?', NULL, 4, true, '{"maxLength": 300}'::jsonb),
  ('00000000-0000-4000-a002-000000000006', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'paragraph', 'Why do you want to judge?', NULL, 5, true, '{"maxLength": 2000}'::jsonb),
  ('00000000-0000-4000-a002-000000000007', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'checkboxes', 'I understand that if selected, I am responsible for arranging my own transportation to and from the event.', NULL, 6, true, NULL),
  ('00000000-0000-4000-a002-000000000008', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'checkboxes', 'I understand that if selected, I am expected to be present for the full duration of my assigned judging block.', NULL, 7, true, NULL),
  ('00000000-0000-4000-a002-000000000009', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'checkboxes', 'I agree to abide by the MLH Code of Conduct.', 'Read it here: https://static.mlh.io/docs/mlh-code-of-conduct.pdf', 8, true, NULL),
  ('00000000-0000-4000-a002-000000000010', '00000000-0000-4000-a000-000000000102', '00000000-0000-4000-a000-000000000002', 'checkboxes', 'I consent to being contacted at this email address about PatriotHacks.', NULL, 9, true, NULL)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "question_options" ("id", "question_id", "kind", "label", "value", "position")
VALUES
  ('00000000-0000-4000-b002-000000000001', '00000000-0000-4000-a002-000000000002', 'choice', 'Yes', 'yes', 0),
  ('00000000-0000-4000-b002-000000000002', '00000000-0000-4000-a002-000000000002', 'choice', 'No', 'no', 1),
  ('00000000-0000-4000-b002-000000000003', '00000000-0000-4000-a002-000000000007', 'choice', 'I agree', 'agree', 0),
  ('00000000-0000-4000-b002-000000000004', '00000000-0000-4000-a002-000000000008', 'choice', 'I agree', 'agree', 0),
  ('00000000-0000-4000-b002-000000000005', '00000000-0000-4000-a002-000000000009', 'choice', 'I agree', 'agree', 0),
  ('00000000-0000-4000-b002-000000000006', '00000000-0000-4000-a002-000000000010', 'choice', 'I agree', 'agree', 0)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
DO $$
BEGIN
  IF to_regclass('public.judges') IS NOT NULL THEN
    INSERT INTO "submissions" ("id", "form_id", "user_id", "respondent_email", "status", "submitted_at", "created_at", "updated_at")
    SELECT r.id, '00000000-0000-4000-a000-000000000002', NULL, lower(btrim(r.email)), 'submitted', r.created_at, r.created_at, r.created_at
    FROM public.judges r
    ON CONFLICT DO NOTHING;

    INSERT INTO "answers" ("submission_id", "question_id", "value", "updated_at")
    SELECT r.id, a.question_id, a.value, r.created_at
    FROM public.judges r
    CROSS JOIN LATERAL (VALUES
      ('00000000-0000-4000-a002-000000000001'::uuid, to_jsonb(r.name)),
      ('00000000-0000-4000-a002-000000000002'::uuid, to_jsonb(CASE WHEN r.is_gmu_alum THEN 'yes' ELSE 'no' END)),
      ('00000000-0000-4000-a002-000000000003'::uuid, to_jsonb(r.company)),
      ('00000000-0000-4000-a002-000000000004'::uuid, to_jsonb(r.job_title)),
      ('00000000-0000-4000-a002-000000000005'::uuid, to_jsonb(r.expertise)),
      ('00000000-0000-4000-a002-000000000006'::uuid, to_jsonb(r.reason)),
      ('00000000-0000-4000-a002-000000000007'::uuid, '["agree"]'::jsonb),
      ('00000000-0000-4000-a002-000000000008'::uuid, '["agree"]'::jsonb),
      ('00000000-0000-4000-a002-000000000009'::uuid, '["agree"]'::jsonb),
      ('00000000-0000-4000-a002-000000000010'::uuid, '["agree"]'::jsonb)
    ) AS a(question_id, value)
    WHERE EXISTS (SELECT 1 FROM "submissions" s WHERE s.id = r.id)
    ON CONFLICT DO NOTHING;
  END IF;
END
$$;
