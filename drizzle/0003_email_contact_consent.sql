ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_contact_consent_at" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_contact_consent_version" text;
