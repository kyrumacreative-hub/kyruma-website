CREATE TABLE "PublicRequestRateLimit" (
    "id" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "subjectHash" TEXT NOT NULL,
    "windowStartedAt" TIMESTAMP(3) NOT NULL,
    "requestCount" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PublicRequestRateLimit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PublicRequestRateLimit_route_subjectHash_windowStartedAt_idx"
ON "PublicRequestRateLimit"("route", "subjectHash", "windowStartedAt");

CREATE INDEX "PublicRequestRateLimit_expiresAt_idx"
ON "PublicRequestRateLimit"("expiresAt");
