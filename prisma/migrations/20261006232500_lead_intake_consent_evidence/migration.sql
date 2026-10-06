ALTER TABLE "LeadIntake"
ADD COLUMN "privacyAcceptedAt" TIMESTAMP(3),
ADD COLUMN "newsletterOptIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "newsletterConsentAt" TIMESTAMP(3);

ALTER TABLE "LeadIntake"
ADD CONSTRAINT "LeadIntake_newsletter_consent_consistency"
CHECK (
  ("newsletterOptIn" = false AND "newsletterConsentAt" IS NULL)
  OR
  ("newsletterOptIn" = true AND "newsletterConsentAt" IS NOT NULL)
);
