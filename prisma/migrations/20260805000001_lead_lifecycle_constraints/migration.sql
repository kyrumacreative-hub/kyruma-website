-- Preserve archive metadata required by PS-004 Archive & Reactivation.
-- The active Lead and Owner partial unique indexes were created by the initial
-- domain migration and must not be recreated here.
ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "archivedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "archiveReason" TEXT;
