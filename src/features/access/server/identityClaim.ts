export function requireVerifiedPrimaryEmail(
  email: string | undefined,
  verificationStatus: string | null | undefined,
): string {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) throw new Error("IDENTITY_EMAIL_REQUIRED");
  if (verificationStatus !== "verified") throw new Error("IDENTITY_EMAIL_UNVERIFIED");
  return normalized;
}

export function requireStableSubjectBinding(
  storedSubjectId: string,
  authenticatedSubjectId: string,
): void {
  if (storedSubjectId !== authenticatedSubjectId) {
    throw new Error("IDENTITY_SUBJECT_CONFLICT");
  }
}
