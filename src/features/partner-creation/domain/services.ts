import { InvalidPartnerValueError } from "./errors";
import { PartnerCode, WorkspaceId, MembershipId } from "./valueObjects";
export class PartnerCodeAllocationService { allocate(sequence: number) { if (!Number.isInteger(sequence) || sequence < 1) throw new InvalidPartnerValueError("Partner code sequence must be positive."); return PartnerCode.create(`KYR-${String(sequence).padStart(3, "0")}`); } }
export class WorkspaceProvisioningService { primary(id: string) { return WorkspaceId.create(id); } }
export class InitialMembershipService { owner(id: string) { return MembershipId.create(id); } }
export class PartnerCreationService { validateIdempotency(existingCorrelationId: string | undefined, requestedCorrelationId: string) { if (existingCorrelationId && existingCorrelationId !== requestedCorrelationId) throw new InvalidPartnerValueError("Lead already has a different Partner Creation request."); } }
