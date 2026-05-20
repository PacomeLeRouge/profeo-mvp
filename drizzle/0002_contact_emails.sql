ALTER TABLE "student_profiles" ADD COLUMN IF NOT EXISTS "contact_email" text;
ALTER TABLE "tutor_profiles" ADD COLUMN IF NOT EXISTS "contact_email" text;

UPDATE "student_profiles" sp
SET "contact_email" = u."email"
FROM "users" u
WHERE sp."user_id" = u."id" AND sp."contact_email" IS NULL;

UPDATE "tutor_profiles" tp
SET "contact_email" = u."email"
FROM "users" u
WHERE tp."user_id" = u."id" AND tp."contact_email" IS NULL;

ALTER TABLE "student_profiles" ALTER COLUMN "contact_email" SET NOT NULL;
ALTER TABLE "tutor_profiles" ALTER COLUMN "contact_email" SET NOT NULL;

ALTER TABLE "lesson_requests" ADD COLUMN IF NOT EXISTS "student_name" text;
ALTER TABLE "lesson_requests" ADD COLUMN IF NOT EXISTS "student_contact_email" text;
ALTER TABLE "lesson_requests" ADD COLUMN IF NOT EXISTS "tutor_contact_email" text;

UPDATE "lesson_requests" AS lr
SET
  "student_name" = u."name",
  "student_contact_email" = COALESCE(sp."contact_email", u."email"),
  "tutor_contact_email" = COALESCE(tp."contact_email", tu."email")
FROM "users" AS u
INNER JOIN "student_profiles" AS sp ON sp."user_id" = u."id"
INNER JOIN "tutor_profiles" AS tp ON tp."id" = lr."tutor_profile_id"
INNER JOIN "users" AS tu ON tu."id" = tp."user_id"
WHERE lr."student_user_id" = u."id";

UPDATE "lesson_requests" SET "student_name" = 'Étudiant' WHERE "student_name" IS NULL;
UPDATE "lesson_requests" SET "student_contact_email" = 'inconnu@example.com' WHERE "student_contact_email" IS NULL;
UPDATE "lesson_requests" SET "tutor_contact_email" = 'inconnu@example.com' WHERE "tutor_contact_email" IS NULL;

ALTER TABLE "lesson_requests" ALTER COLUMN "student_name" SET NOT NULL;
ALTER TABLE "lesson_requests" ALTER COLUMN "student_contact_email" SET NOT NULL;
ALTER TABLE "lesson_requests" ALTER COLUMN "tutor_contact_email" SET NOT NULL;
