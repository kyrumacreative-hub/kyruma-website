CREATE TABLE "IdentityUser" (
  "id" TEXT NOT NULL,
  "externalSubjectId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "normalizedEmail" TEXT NOT NULL,
  "displayName" TEXT,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "lastSignedInAt" TIMESTAMP(3),
  CONSTRAINT "IdentityUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FoundationMembership" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "role" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "grants" JSONB NOT NULL,
  "revocations" JSONB NOT NULL,
  "invitedAt" TIMESTAMP(3),
  "joinedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "FoundationMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AccessInvitation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "email" TEXT NOT NULL,
  "normalizedEmail" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "acceptedBy" TEXT,
  "acceptedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "correlationId" TEXT NOT NULL,
  CONSTRAINT "AccessInvitation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PortalShare" ("id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "partnerId" TEXT NOT NULL, "workspaceId" TEXT NOT NULL, "kind" TEXT NOT NULL, "title" TEXT NOT NULL, "summary" TEXT, "externalUrl" TEXT, "visibility" TEXT NOT NULL, "publishedAt" TIMESTAMP(3) NOT NULL, "publishedBy" TEXT NOT NULL, CONSTRAINT "PortalShare_pkey" PRIMARY KEY ("id"));
CREATE TABLE "PortalActivity" ("id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "partnerId" TEXT NOT NULL, "workspaceId" TEXT NOT NULL, "eventType" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "occurredAt" TIMESTAMP(3) NOT NULL, "sourceId" TEXT NOT NULL, CONSTRAINT "PortalActivity_pkey" PRIMARY KEY ("id"));
CREATE TABLE "PortalDeliverable" ("id" TEXT NOT NULL, "deliverableId" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "partnerId" TEXT NOT NULL, "workspaceId" TEXT NOT NULL, "title" TEXT NOT NULL, "status" TEXT NOT NULL, "version" INTEGER NOT NULL, "externalUrl" TEXT, "sharedAt" TIMESTAMP(3) NOT NULL, "approvedAt" TIMESTAMP(3), CONSTRAINT "PortalDeliverable_pkey" PRIMARY KEY ("id"));
CREATE TABLE "AutomationDefinition" ("id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "name" TEXT NOT NULL, "status" TEXT NOT NULL, "triggerType" TEXT NOT NULL, "triggerVersion" INTEGER NOT NULL, "conditions" JSONB NOT NULL, "actionType" TEXT NOT NULL, "actionConfig" JSONB NOT NULL, "version" INTEGER NOT NULL, "createdBy" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "AutomationDefinition_pkey" PRIMARY KEY ("id"));
CREATE TABLE "AutomationRun" ("id" TEXT NOT NULL, "automationId" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "sourceEventId" TEXT NOT NULL, "correlationId" TEXT NOT NULL, "status" TEXT NOT NULL, "attemptCount" INTEGER NOT NULL, "result" JSONB, "errorCode" TEXT, "startedAt" TIMESTAMP(3) NOT NULL, "completedAt" TIMESTAMP(3), "nextRetryAt" TIMESTAMP(3), CONSTRAINT "AutomationRun_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "IdentityUser_externalSubjectId_key" ON "IdentityUser"("externalSubjectId");
CREATE UNIQUE INDEX "IdentityUser_normalizedEmail_key" ON "IdentityUser"("normalizedEmail");
CREATE INDEX "IdentityUser_status_createdAt_idx" ON "IdentityUser"("status", "createdAt");
CREATE INDEX "FoundationMembership_userId_status_idx" ON "FoundationMembership"("userId", "status");
CREATE INDEX "FoundationMembership_organizationId_status_idx" ON "FoundationMembership"("organizationId", "status");
CREATE INDEX "FoundationMembership_partnerId_workspaceId_status_idx" ON "FoundationMembership"("partnerId", "workspaceId", "status");
CREATE UNIQUE INDEX "AccessInvitation_tokenHash_key" ON "AccessInvitation"("tokenHash");
CREATE UNIQUE INDEX "AccessInvitation_correlationId_key" ON "AccessInvitation"("correlationId");
CREATE INDEX "AccessInvitation_organizationId_status_expiresAt_idx" ON "AccessInvitation"("organizationId", "status", "expiresAt");
CREATE INDEX "AccessInvitation_normalizedEmail_status_idx" ON "AccessInvitation"("normalizedEmail", "status");
CREATE INDEX "PortalShare_workspaceId_visibility_publishedAt_idx" ON "PortalShare"("workspaceId", "visibility", "publishedAt");
CREATE INDEX "PortalShare_organizationId_partnerId_idx" ON "PortalShare"("organizationId", "partnerId");
CREATE UNIQUE INDEX "PortalActivity_workspaceId_eventType_sourceId_key" ON "PortalActivity"("workspaceId", "eventType", "sourceId");
CREATE INDEX "PortalActivity_workspaceId_occurredAt_idx" ON "PortalActivity"("workspaceId", "occurredAt");
CREATE UNIQUE INDEX "PortalDeliverable_workspaceId_deliverableId_version_key" ON "PortalDeliverable"("workspaceId", "deliverableId", "version");
CREATE INDEX "PortalDeliverable_workspaceId_status_sharedAt_idx" ON "PortalDeliverable"("workspaceId", "status", "sharedAt");
CREATE UNIQUE INDEX "AutomationDefinition_organizationId_name_version_key" ON "AutomationDefinition"("organizationId", "name", "version");
CREATE INDEX "AutomationDefinition_organizationId_status_triggerType_triggerVersion_idx" ON "AutomationDefinition"("organizationId", "status", "triggerType", "triggerVersion");
CREATE UNIQUE INDEX "AutomationRun_automationId_sourceEventId_key" ON "AutomationRun"("automationId", "sourceEventId");
CREATE INDEX "AutomationRun_organizationId_status_nextRetryAt_idx" ON "AutomationRun"("organizationId", "status", "nextRetryAt");

ALTER TABLE "FoundationMembership" ADD CONSTRAINT "FoundationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "IdentityUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AutomationRun" ADD CONSTRAINT "AutomationRun_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "AutomationDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "IdentityUser" ADD CONSTRAINT "IdentityUser_status_check" CHECK ("status" IN ('active', 'suspended'));
ALTER TABLE "FoundationMembership" ADD CONSTRAINT "FoundationMembership_status_check" CHECK ("status" IN ('invited', 'active', 'revoked'));
ALTER TABLE "AccessInvitation" ADD CONSTRAINT "AccessInvitation_status_check" CHECK ("status" IN ('pending', 'accepted', 'revoked', 'expired'));
ALTER TABLE "PortalShare" ADD CONSTRAINT "PortalShare_visibility_check" CHECK ("visibility" IN ('shared', 'partner_private'));
ALTER TABLE "PortalDeliverable" ADD CONSTRAINT "PortalDeliverable_status_check" CHECK ("status" IN ('shared', 'in_review', 'approved', 'superseded'));
ALTER TABLE "AutomationDefinition" ADD CONSTRAINT "AutomationDefinition_status_check" CHECK ("status" IN ('draft', 'active', 'paused', 'archived'));
ALTER TABLE "AutomationRun" ADD CONSTRAINT "AutomationRun_status_check" CHECK ("status" IN ('running', 'completed', 'failed'));
