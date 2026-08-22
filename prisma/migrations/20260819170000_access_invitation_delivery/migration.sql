ALTER TABLE "AccessInvitation"
ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "deliveryStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "providerId" TEXT,
ADD COLUMN "deliveredAt" TIMESTAMP(3);

CREATE INDEX "AccessInvitation_deliveryStatus_createdAt_idx"
ON "AccessInvitation" ("deliveryStatus", "createdAt")
WHERE "deliveryStatus" IN ('pending', 'failed');
