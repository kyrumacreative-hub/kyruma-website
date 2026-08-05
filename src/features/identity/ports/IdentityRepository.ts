import type { AuthenticatedActor, Membership, UserIdentity } from "../domain/types";

/** Persistence boundary intended for a PostgreSQL implementation selected in a later approved task. */
export interface IdentityRepository {
  findActorByExternalSubjectId(externalSubjectId: string): Promise<AuthenticatedActor | null>;
  createUser(user: UserIdentity): Promise<UserIdentity>;
  saveMembership(membership: Membership): Promise<Membership>;
  revokeMembership(membershipId: string, revokedAt: Date): Promise<void>;
}
