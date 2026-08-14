CREATE TABLE "EventOutbox" (
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "eventVersion" INTEGER NOT NULL,
  "organizationId" TEXT NOT NULL,
  "aggregateType" TEXT NOT NULL,
  "aggregateId" TEXT NOT NULL,
  "correlationId" TEXT NOT NULL,
  "causationId" TEXT,
  "envelope" JSONB NOT NULL,
  "status" TEXT NOT NULL,
  "availableAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "dispatchedAt" TIMESTAMP(3),
  "lockedAt" TIMESTAMP(3),
  "lockOwner" TEXT,
  CONSTRAINT "EventOutbox_pkey" PRIMARY KEY ("eventId"),
  CONSTRAINT "EventOutbox_status_check" CHECK ("status" IN ('pending','dispatching','dispatched'))
);

CREATE TABLE "EventProcessingRecord" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "consumer" TEXT NOT NULL,
  "handler" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "reprocessCount" INTEGER NOT NULL DEFAULT 0,
  "firstAttemptAt" TIMESTAMP(3),
  "lastAttemptAt" TIMESTAMP(3),
  "processedAt" TIMESTAMP(3),
  "nextRetryAt" TIMESTAMP(3),
  "errorCode" TEXT,
  "errorMessage" TEXT,
  "lockedAt" TIMESTAMP(3),
  "lockOwner" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventProcessingRecord_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EventProcessingRecord_status_check" CHECK ("status" IN ('pending','processing','processed','retrying','dead_lettered')),
  CONSTRAINT "EventProcessingRecord_attempt_check" CHECK ("attemptCount" >= 0),
  CONSTRAINT "EventProcessingRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "EventOutbox"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "EventOutbox_status_availableAt_createdAt_idx" ON "EventOutbox"("status", "availableAt", "createdAt");
CREATE INDEX "EventOutbox_organizationId_createdAt_idx" ON "EventOutbox"("organizationId", "createdAt");
CREATE INDEX "EventOutbox_correlationId_idx" ON "EventOutbox"("correlationId");
CREATE UNIQUE INDEX "EventProcessingRecord_eventId_consumer_handler_key" ON "EventProcessingRecord"("eventId", "consumer", "handler");
CREATE INDEX "EventProcessingRecord_status_nextRetryAt_createdAt_idx" ON "EventProcessingRecord"("status", "nextRetryAt", "createdAt");
CREATE INDEX "EventProcessingRecord_eventId_status_idx" ON "EventProcessingRecord"("eventId", "status");

CREATE OR REPLACE FUNCTION kyruma_prevent_event_outbox_mutation() RETURNS trigger AS $$
BEGIN
  IF NEW."eventId" <> OLD."eventId" OR NEW."eventType" <> OLD."eventType" OR NEW."eventVersion" <> OLD."eventVersion"
     OR NEW."organizationId" <> OLD."organizationId" OR NEW."aggregateType" <> OLD."aggregateType"
     OR NEW."aggregateId" <> OLD."aggregateId" OR NEW."correlationId" <> OLD."correlationId"
     OR NEW."causationId" IS DISTINCT FROM OLD."causationId" OR NEW."envelope" <> OLD."envelope"
     OR NEW."createdAt" <> OLD."createdAt" THEN
    RAISE EXCEPTION 'EventOutbox envelope is immutable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "EventOutbox_immutable_envelope" BEFORE UPDATE ON "EventOutbox"
FOR EACH ROW EXECUTE FUNCTION kyruma_prevent_event_outbox_mutation();
