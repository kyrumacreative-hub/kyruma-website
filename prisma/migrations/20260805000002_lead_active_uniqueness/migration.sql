-- A Lead that has completed Partner Creation is no longer an active Lead.
DROP INDEX "Lead_active_organization_unique";
CREATE UNIQUE INDEX "Lead_active_organization_unique"
  ON "Lead"("organizationId")
  WHERE "status" NOT IN ('archived', 'partner_created');
