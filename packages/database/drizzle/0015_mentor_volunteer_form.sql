-- The `volunteer` form becomes "Mentor / Volunteer". The first section asks
-- for a role and branches: volunteers continue to the volunteer questions,
-- mentors jump to the mentor questions, and both paths end on the shared
-- acknowledgements. Existing questions keep their ids and only change section,
-- so no answer is touched. Every existing submission was a volunteer, so each
-- gets "volunteer" as its role answer and still walks through every question
-- it answered. Every id is fixed, so re-running this changes nothing.
--> statement-breakpoint
UPDATE "forms" SET
  "title" = 'Mentor / Volunteer',
  "description" = 'Volunteers keep PatriotHacks running — checking hackers in, handing out meals, staffing the help desk, and making sure everyone has what they need. Mentors help teams get unstuck — talking through ideas, debugging, and sharing what they know from industry or research. Pick the role that fits you, fill this out, and we''ll reach out as the event gets closer with shifts and details.',
  "updated_at" = now()
WHERE "id" = '00000000-0000-4000-a000-000000000001';
--> statement-breakpoint
INSERT INTO "form_sections" ("id", "form_id", "title", "position", "next_action", "next_section_id")
VALUES
  ('00000000-0000-4000-a000-000000000103', '00000000-0000-4000-a000-000000000001', 'Volunteering', 1, 'section', '00000000-0000-4000-a000-000000000105'),
  ('00000000-0000-4000-a000-000000000104', '00000000-0000-4000-a000-000000000001', 'Mentoring', 2, 'next', NULL),
  ('00000000-0000-4000-a000-000000000105', '00000000-0000-4000-a000-000000000001', 'Agreements', 3, 'submit', NULL)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
UPDATE "questions" SET "section_id" = m.section_id, "position" = m.position, "updated_at" = now()
FROM (VALUES
  ('00000000-0000-4000-a001-000000000003'::uuid, '00000000-0000-4000-a000-000000000103'::uuid, 0),
  ('00000000-0000-4000-a001-000000000005'::uuid, '00000000-0000-4000-a000-000000000103'::uuid, 1),
  ('00000000-0000-4000-a001-000000000004'::uuid, '00000000-0000-4000-a000-000000000105'::uuid, 0),
  ('00000000-0000-4000-a001-000000000006'::uuid, '00000000-0000-4000-a000-000000000105'::uuid, 1),
  ('00000000-0000-4000-a001-000000000007'::uuid, '00000000-0000-4000-a000-000000000105'::uuid, 2)
) AS m(id, section_id, position)
WHERE "questions"."id" = m.id
  AND ("questions"."section_id", "questions"."position") IS DISTINCT FROM (m.section_id, m.position);
--> statement-breakpoint
INSERT INTO "questions" ("id", "section_id", "form_id", "type", "label", "help_text", "position", "required", "config")
VALUES
  ('00000000-0000-4000-a001-000000000008', '00000000-0000-4000-a000-000000000101', '00000000-0000-4000-a000-000000000001', 'multiple_choice', 'Would you like to volunteer or mentor?', NULL, 2, true, NULL),
  ('00000000-0000-4000-a001-000000000009', '00000000-0000-4000-a000-000000000104', '00000000-0000-4000-a000-000000000001', 'short_answer', 'What company or organization are you with?', NULL, 0, true, '{"maxLength": 160}'::jsonb),
  ('00000000-0000-4000-a001-000000000010', '00000000-0000-4000-a000-000000000104', '00000000-0000-4000-a000-000000000001', 'short_answer', 'What is your role or job title?', NULL, 1, true, '{"maxLength": 160}'::jsonb),
  ('00000000-0000-4000-a001-000000000011', '00000000-0000-4000-a000-000000000104', '00000000-0000-4000-a000-000000000001', 'short_answer', 'What is your area of expertise?', NULL, 2, true, '{"maxLength": 300}'::jsonb),
  ('00000000-0000-4000-a001-000000000012', '00000000-0000-4000-a000-000000000104', '00000000-0000-4000-a000-000000000001', 'paragraph', 'Why do you want to mentor?', NULL, 3, true, '{"maxLength": 2000}'::jsonb),
  ('00000000-0000-4000-a001-000000000013', '00000000-0000-4000-a000-000000000104', '00000000-0000-4000-a000-000000000001', 'checkboxes', 'I understand that if selected, I am expected to be present for the full duration of my assigned mentoring block.', NULL, 4, true, NULL)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "question_options" ("id", "question_id", "kind", "label", "value", "position", "next_action", "next_section_id")
VALUES
  ('00000000-0000-4000-b001-000000000007', '00000000-0000-4000-a001-000000000008', 'choice', 'Volunteer', 'volunteer', 0, 'next', NULL),
  ('00000000-0000-4000-b001-000000000008', '00000000-0000-4000-a001-000000000008', 'choice', 'Mentor', 'mentor', 1, 'section', '00000000-0000-4000-a000-000000000104'),
  ('00000000-0000-4000-b001-000000000009', '00000000-0000-4000-a001-000000000013', 'choice', 'I agree', 'agree', 0, 'next', NULL)
ON CONFLICT DO NOTHING;
--> statement-breakpoint
UPDATE "form_sections" SET "next_action" = 'next', "next_section_id" = NULL
WHERE "id" = '00000000-0000-4000-a000-000000000101';
--> statement-breakpoint
INSERT INTO "answers" ("submission_id", "question_id", "value", "updated_at")
SELECT s.id, '00000000-0000-4000-a001-000000000008', to_jsonb('volunteer'::text), s.created_at
FROM "submissions" s
WHERE s.form_id = '00000000-0000-4000-a000-000000000001'
ON CONFLICT DO NOTHING;
