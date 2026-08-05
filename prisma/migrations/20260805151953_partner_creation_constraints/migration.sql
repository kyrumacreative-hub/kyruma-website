-- This is an empty migration.
-- Allow any number of secondary workspaces while enforcing one primary workspace.
DROP INDEX "PartnerWorkspace_partnerId_primary_key";
CREATE UNIQUE INDEX "PartnerWorkspace_one_primary_per_partner" ON "PartnerWorkspace"("partnerId") WHERE "primary" = true;

-- Seed the transactionally locked allocation row. Repositories must update it with SELECT ... FOR UPDATE.
INSERT INTO "PartnerCodeSequence" ("id", "nextValue") VALUES (1, 1)
ON CONFLICT ("id") DO NOTHING;
