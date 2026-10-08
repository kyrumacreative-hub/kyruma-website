CREATE TABLE "AccessRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "normalizedEmail" TEXT NOT NULL,
  "displayName" TEXT,
  "status" TEXT NOT NULL,
  "requestedAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "resolvedAt" TIMESTAMP(3),
  "resolvedBy" TEXT,
  "workspaceId" TEXT,

  CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AccessRequest_userId_key" ON "AccessRequest"("userId");
CREATE INDEX "AccessRequest_status_requestedAt_idx" ON "AccessRequest"("status", "requestedAt");
CREATE INDEX "AccessRequest_normalizedEmail_status_idx" ON "AccessRequest"("normalizedEmail", "status");
