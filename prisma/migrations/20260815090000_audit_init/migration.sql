CREATE TABLE "AuditEvent" (
  "id" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actorId" TEXT NOT NULL,
  "actorType" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "resourceType" TEXT NOT NULL,
  "resourceId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "result" TEXT NOT NULL,
  "correlationId" TEXT NOT NULL,
  "causationId" TEXT,
  "requestId" TEXT,
  "source" TEXT NOT NULL,
  "metadata" JSONB NOT NULL,
  "changes" JSONB NOT NULL,
  "schemaVersion" INTEGER NOT NULL,
  "classification" TEXT NOT NULL,
  "retentionCategory" TEXT NOT NULL,
  "policyVersion" TEXT NOT NULL,
  CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AuditEvent_schemaVersion_check" CHECK ("schemaVersion" > 0),
  CONSTRAINT "AuditEvent_result_check" CHECK ("result" IN ('success','failed','denied')),
  CONSTRAINT "AuditEvent_actorType_check" CHECK ("actorType" IN ('user','system')),
  CONSTRAINT "AuditEvent_classification_check" CHECK ("classification" IN ('internal','restricted_security'))
);

CREATE TABLE "AuditPrivacyOverlay" (
  "id" TEXT NOT NULL, "auditEventId" TEXT NOT NULL, "organizationId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL, "policyVersion" TEXT NOT NULL, "reason" TEXT NOT NULL,
  "replacements" JSONB NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AuditPrivacyOverlay_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AuditExportEvidence" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "requestedBy" TEXT NOT NULL,
  "from" TIMESTAMP(3) NOT NULL, "to" TIMESTAMP(3) NOT NULL, "format" TEXT NOT NULL,
  "profile" TEXT NOT NULL, "rowCount" INTEGER NOT NULL, "artifactReference" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AuditExportEvidence_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AuditRetentionExecution" (
  "id" TEXT NOT NULL, "organizationId" TEXT NOT NULL, "policyVersion" TEXT NOT NULL,
  "category" TEXT NOT NULL, "dryRun" BOOLEAN NOT NULL, "affectedCount" INTEGER NOT NULL,
  "executedBy" TEXT NOT NULL, "executedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AuditRetentionExecution_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuditEvent_idempotency_key" ON "AuditEvent"("organizationId","correlationId","eventType","resourceType","resourceId","schemaVersion");
CREATE INDEX "AuditEvent_timeline_idx" ON "AuditEvent"("organizationId","occurredAt","recordedAt","id");
CREATE INDEX "AuditEvent_resource_idx" ON "AuditEvent"("organizationId","resourceType","resourceId","occurredAt");
CREATE INDEX "AuditEvent_actor_idx" ON "AuditEvent"("organizationId","actorId","occurredAt");
CREATE INDEX "AuditEvent_correlation_idx" ON "AuditEvent"("organizationId","correlationId");
CREATE INDEX "AuditEvent_retention_idx" ON "AuditEvent"("organizationId","retentionCategory","occurredAt");
CREATE INDEX "AuditPrivacyOverlay_lookup_idx" ON "AuditPrivacyOverlay"("organizationId","auditEventId","createdAt");
CREATE INDEX "AuditExportEvidence_org_created_idx" ON "AuditExportEvidence"("organizationId","createdAt");
CREATE INDEX "AuditRetentionExecution_org_executed_idx" ON "AuditRetentionExecution"("organizationId","executedAt");
ALTER TABLE "AuditPrivacyOverlay" ADD CONSTRAINT "AuditPrivacyOverlay_auditEventId_fkey" FOREIGN KEY ("auditEventId") REFERENCES "AuditEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION kyruma_reject_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'audit evidence is append-only' USING ERRCODE = '55000'; END;
$$;
CREATE TRIGGER "AuditEvent_append_only" BEFORE UPDATE OR DELETE OR TRUNCATE ON "AuditEvent" FOR EACH STATEMENT EXECUTE FUNCTION kyruma_reject_audit_mutation();
CREATE TRIGGER "AuditPrivacyOverlay_append_only" BEFORE UPDATE OR DELETE OR TRUNCATE ON "AuditPrivacyOverlay" FOR EACH STATEMENT EXECUTE FUNCTION kyruma_reject_audit_mutation();
CREATE TRIGGER "AuditExportEvidence_append_only" BEFORE UPDATE OR DELETE OR TRUNCATE ON "AuditExportEvidence" FOR EACH STATEMENT EXECUTE FUNCTION kyruma_reject_audit_mutation();
CREATE TRIGGER "AuditRetentionExecution_append_only" BEFORE UPDATE OR DELETE OR TRUNCATE ON "AuditRetentionExecution" FOR EACH STATEMENT EXECUTE FUNCTION kyruma_reject_audit_mutation();
