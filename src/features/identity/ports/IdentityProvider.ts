export interface ProviderSession {
  subjectId: string;
  email: string;
  displayName?: string;
  expiresAt: Date;
}

/** Provider boundary: no feature may import a concrete authentication SDK directly. */
export interface IdentityProvider {
  getSession(): Promise<ProviderSession | null>;
  revokeSubjectSessions(subjectId: string): Promise<void>;
}
