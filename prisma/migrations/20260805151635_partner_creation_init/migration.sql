-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "primaryWorkspaceId" TEXT NOT NULL,
    "initialOwnerMembershipId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "correlationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerCodeSequence" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nextValue" INTEGER NOT NULL,

    CONSTRAINT "PartnerCodeSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerWorkspace" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL,

    CONSTRAINT "PartnerWorkspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerMembership" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "PartnerMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerCreationIdempotency" (
    "correlationId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerCreationIdempotency_pkey" PRIMARY KEY ("correlationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_code_key" ON "Partner"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_leadId_key" ON "Partner"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_primaryWorkspaceId_key" ON "Partner"("primaryWorkspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_initialOwnerMembershipId_key" ON "Partner"("initialOwnerMembershipId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_correlationId_key" ON "Partner"("correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerWorkspace_partnerId_primary_key" ON "PartnerWorkspace"("partnerId", "primary");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerMembership_partnerId_role_key" ON "PartnerMembership"("partnerId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerCreationIdempotency_partnerId_key" ON "PartnerCreationIdempotency"("partnerId");

-- AddForeignKey
ALTER TABLE "PartnerWorkspace" ADD CONSTRAINT "PartnerWorkspace_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerMembership" ADD CONSTRAINT "PartnerMembership_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
