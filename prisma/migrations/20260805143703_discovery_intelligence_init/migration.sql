-- CreateTable
CREATE TABLE "IntelligenceSnapshot" (
    "id" TEXT NOT NULL,
    "discoverySubmissionId" TEXT NOT NULL,
    "submissionVersion" INTEGER NOT NULL,
    "scopeType" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "partnerId" TEXT,
    "workspaceId" TEXT,
    "contentHash" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "retentionPolicyVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "IntelligenceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntelligenceAnalysis" (
    "id" TEXT NOT NULL,
    "sourceSnapshotId" TEXT NOT NULL,
    "discoverySubmissionId" TEXT NOT NULL,
    "discoverySubmissionVersion" INTEGER NOT NULL,
    "analysisVersion" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "modelReference" TEXT NOT NULL,
    "modelRunId" TEXT,
    "promptTemplateVersion" INTEGER NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "generatedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "confidence" DOUBLE PRECISION,
    "correlationId" TEXT NOT NULL,

    CONSTRAINT "IntelligenceAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntelligenceSnapshot_organizationId_createdAt_idx" ON "IntelligenceSnapshot"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IntelligenceSnapshot_discoverySubmissionId_submissionVersio_key" ON "IntelligenceSnapshot"("discoverySubmissionId", "submissionVersion");

-- CreateIndex
CREATE INDEX "IntelligenceAnalysis_discoverySubmissionId_analysisVersion_idx" ON "IntelligenceAnalysis"("discoverySubmissionId", "analysisVersion");

-- CreateIndex
CREATE UNIQUE INDEX "IntelligenceAnalysis_sourceSnapshotId_analysisVersion_key" ON "IntelligenceAnalysis"("sourceSnapshotId", "analysisVersion");

-- CreateIndex
CREATE UNIQUE INDEX "IntelligenceAnalysis_sourceSnapshotId_correlationId_key" ON "IntelligenceAnalysis"("sourceSnapshotId", "correlationId");

-- AddForeignKey
ALTER TABLE "IntelligenceAnalysis" ADD CONSTRAINT "IntelligenceAnalysis_sourceSnapshotId_fkey" FOREIGN KEY ("sourceSnapshotId") REFERENCES "IntelligenceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
