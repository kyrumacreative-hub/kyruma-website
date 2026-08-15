-- Canonical, provider-neutral pointer from an Operations Project to its
-- documentary destination. It deliberately has no foreign key: Project scope
-- remains an explicit cross-context boundary throughout KYRUMA OS.
CREATE TABLE "ProjectDocumentReference" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalReference" TEXT,
    "externalUrl" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastError" TEXT,
    "attemptCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDocumentReference_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProjectDocumentReference_provider_check" CHECK ("provider" = 'google_drive'),
    CONSTRAINT "ProjectDocumentReference_status_check" CHECK ("status" IN ('pending', 'linked', 'failed')),
    CONSTRAINT "ProjectDocumentReference_linked_reference_check" CHECK (
      ("status" = 'linked' AND "externalReference" IS NOT NULL AND "externalUrl" IS NOT NULL)
      OR ("status" <> 'linked')
    )
);

CREATE UNIQUE INDEX "ProjectDocumentReference_projectId_key" ON "ProjectDocumentReference"("projectId");
CREATE UNIQUE INDEX "ProjectDocumentReference_externalReference_key" ON "ProjectDocumentReference"("externalReference");
CREATE UNIQUE INDEX "ProjectDocumentReference_idempotencyKey_key" ON "ProjectDocumentReference"("idempotencyKey");
CREATE INDEX "ProjectDocumentReference_organizationId_workspaceId_idx" ON "ProjectDocumentReference"("organizationId", "workspaceId");
CREATE INDEX "ProjectDocumentReference_partnerId_idx" ON "ProjectDocumentReference"("partnerId");
