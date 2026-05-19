-- Ajoute 4 matières au enum PostgreSQL `subject` (6 → 10)
ALTER TYPE "subject" ADD VALUE IF NOT EXISTS 'Chemistry';
ALTER TYPE "subject" ADD VALUE IF NOT EXISTS 'Economics';
ALTER TYPE "subject" ADD VALUE IF NOT EXISTS 'Geography';
ALTER TYPE "subject" ADD VALUE IF NOT EXISTS 'French';
