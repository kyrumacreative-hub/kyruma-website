CREATE TABLE "LeadIntake" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "normalizedEmail" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "serviceInterest" TEXT NOT NULL,
  "collaboration" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "discoveryStartedAt" TIMESTAMP(3),
  "discoveryCompletedAt" TIMESTAMP(3),
  CONSTRAINT "LeadIntake_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LeadIntake_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "LeadIntake_leadId_key" ON "LeadIntake"("leadId");
CREATE INDEX "LeadIntake_normalizedEmail_createdAt_idx" ON "LeadIntake"("normalizedEmail", "createdAt");
CREATE INDEX "LeadIntake_organizationId_createdAt_idx" ON "LeadIntake"("organizationId", "createdAt");

CREATE TABLE "OperationalTask" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "sourceEventId" TEXT NOT NULL,
  "taskType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "leadId" TEXT,
  "partnerId" TEXT,
  "workspaceId" TEXT,
  "assigneeId" TEXT,
  "dueAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "OperationalTask_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OperationalTask_status_check" CHECK ("status" IN ('open', 'completed'))
);

CREATE UNIQUE INDEX "OperationalTask_organizationId_sourceEventId_taskType_key"
  ON "OperationalTask"("organizationId", "sourceEventId", "taskType");
CREATE INDEX "OperationalTask_organizationId_status_dueAt_idx" ON "OperationalTask"("organizationId", "status", "dueAt");
CREATE INDEX "OperationalTask_leadId_status_idx" ON "OperationalTask"("leadId", "status");
CREATE INDEX "OperationalTask_workspaceId_status_idx" ON "OperationalTask"("workspaceId", "status");
