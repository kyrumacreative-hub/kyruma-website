ALTER TABLE "AccessInvitation"
ADD CONSTRAINT "AccessInvitation_tokenVersion_check"
CHECK ("tokenVersion" > 0),
ADD CONSTRAINT "AccessInvitation_deliveryStatus_check"
CHECK ("deliveryStatus" IN ('pending', 'delivered', 'failed')),
ADD CONSTRAINT "AccessInvitation_deliveryState_check"
CHECK (
  ("deliveryStatus" = 'delivered' AND "providerId" IS NOT NULL AND "deliveredAt" IS NOT NULL)
  OR ("deliveryStatus" <> 'delivered' AND "providerId" IS NULL AND "deliveredAt" IS NULL)
);
