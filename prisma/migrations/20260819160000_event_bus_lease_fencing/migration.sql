ALTER TABLE "EventOutbox" ADD COLUMN "leaseToken" TEXT;
ALTER TABLE "EventProcessingRecord" ADD COLUMN "leaseToken" TEXT;

CREATE INDEX "EventOutbox_claim_idx"
ON "EventOutbox" ("status", "availableAt", "createdAt")
WHERE "status" IN ('pending', 'dispatching');

CREATE INDEX "EventProcessingRecord_claim_idx"
ON "EventProcessingRecord" ("status", "nextRetryAt", "createdAt")
WHERE "status" IN ('pending', 'retrying', 'processing');
