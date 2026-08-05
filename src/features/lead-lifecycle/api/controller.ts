import type { ResolvedOrganizationContext } from "../../partner-context/domain/types";
import type { DomainOperationMetadata } from "../domain/services";
import type { LeadLifecycleApiDependencies, InternalApiRequest, InternalApiResponse } from "./contracts";
import { mapHttpError, MissingOrganizationContextError } from "./errors";
import { body, boolean, id, text } from "./validation";

type Invocation<T> = (context: ResolvedOrganizationContext, operation: DomainOperationMetadata) => Promise<T>;

/**
 * Internal HTTP controllers. They validate transport data, obtain trusted
 * context through an adapter and delegate all behaviour to application services.
 */
export class LeadLifecycleController {
  constructor(private readonly dependencies: LeadLifecycleApiDependencies) {}

  createLead(request: InternalApiRequest): Promise<InternalApiResponse> {
    return this.invoke(request, 201, async (context, operation) => {
      const input = body(request.body);
      return this.dependencies.createLead.execute({
        id: id(input.id, "id"), organizationId: id(input.organizationId, "organizationId"), ownerId: id(input.ownerId, "ownerId"),
        primaryContactId: id(input.primaryContactId, "primaryContactId"), origin: text(input.origin, "origin", 100),
        createdAt: operation.occurredAt, createdBy: context.actor.user.id,
      }, context, operation);
    });
  }

  getLead(request: InternalApiRequest): Promise<InternalApiResponse> { return this.lead(request, (leadId, context, operation) => this.dependencies.getLead.execute({ leadId }, context, operation)); }
  updateLead(request: InternalApiRequest): Promise<InternalApiResponse> {
    return this.leadBody(request, (leadId, input, context, operation) => this.dependencies.updateLead.execute({ leadId, primaryContactId: id(input.primaryContactId, "primaryContactId") }, context, operation));
  }
  archiveLead(request: InternalApiRequest): Promise<InternalApiResponse> {
    return this.leadBody(request, (leadId, input, context, operation) => this.dependencies.archiveLead.execute({ leadId, reason: text(input.reason, "reason") }, context, operation));
  }
  reactivateLead(request: InternalApiRequest): Promise<InternalApiResponse> {
    return this.leadBody(request, (leadId, input, context, operation) => this.dependencies.reactivateLead.execute({ leadId, reason: text(input.reason, "reason") }, context, operation));
  }
  changeOwner(request: InternalApiRequest): Promise<InternalApiResponse> {
    return this.leadBody(request, (leadId, input, context, operation) => this.dependencies.changeOwner.execute({
      leadId, ownerId: id(input.ownerId, "ownerId"), assignedBy: context.actor.user.id, reason: text(input.reason, "reason"),
    }, context, operation));
  }
  getOwnershipHistory(request: InternalApiRequest): Promise<InternalApiResponse> { return this.lead(request, (leadId, context, operation) => this.dependencies.ownershipHistory.execute({ leadId }, context, operation)); }
  startDiscovery(request: InternalApiRequest): Promise<InternalApiResponse> { return this.lead(request, (leadId, context, operation) => this.dependencies.startDiscovery.execute({ leadId }, context, operation)); }
  getDiscoveryStatus(request: InternalApiRequest): Promise<InternalApiResponse> { return this.lead(request, (leadId, context, operation) => this.dependencies.discoveryStatus.execute({ leadId }, context, operation)); }
  startQualification(request: InternalApiRequest): Promise<InternalApiResponse> {
    return this.leadBody(request, (leadId, input, context, operation) => this.dependencies.startQualification.execute({ leadId, hasCompletedDiscovery: boolean(input.hasCompletedDiscovery, "hasCompletedDiscovery") }, context, operation));
  }
  completeQualification(request: InternalApiRequest): Promise<InternalApiResponse> {
    return this.leadBody(request, (leadId, input, context, operation) => this.dependencies.completeQualification.execute({
      leadId, hasCompletedDiscovery: boolean(input.hasCompletedDiscovery, "hasCompletedDiscovery"),
      qualification: {
        id: id(input.qualificationId, "qualificationId"), leadId, decision: text(input.decision, "decision", 100), reason: text(input.reason, "reason"),
        decidedBy: context.actor.user.id, decidedAt: operation.occurredAt,
      },
    }, context, operation));
  }
  createPartner(request: InternalApiRequest): Promise<InternalApiResponse> {
    return this.leadBody(request, (leadId, input, context, operation) => this.dependencies.createPartner.execute({
      leadId, qualificationDecisionId: id(input.qualificationDecisionId, "qualificationDecisionId"),
    }, context, operation));
  }

  private lead(request: InternalApiRequest, action: (leadId: string, context: ResolvedOrganizationContext, operation: DomainOperationMetadata) => Promise<unknown>) {
    return this.invoke(request, 200, async (context, operation) => action(id(request.params?.leadId, "leadId"), context, operation));
  }
  private leadBody(request: InternalApiRequest, action: (leadId: string, input: Record<string, unknown>, context: ResolvedOrganizationContext, operation: DomainOperationMetadata) => Promise<unknown>) {
    return this.invoke(request, 200, async (context, operation) => action(id(request.params?.leadId, "leadId"), body(request.body), context, operation));
  }
  private async invoke<T>(request: InternalApiRequest, status: number, action: Invocation<T>): Promise<InternalApiResponse<T>> {
    try {
      const context = await this.dependencies.contextAdapter.resolve(request);
      if (!context) throw new MissingOrganizationContextError("Organization context is required.");
      const data = await action(context, this.dependencies.operationMetadata.create(context, request));
      return { status, body: { ok: true, data } };
    } catch (error) {
      const mapped = mapHttpError(error);
      return { status: mapped.status, body: { ok: false, error: { code: mapped.code } } };
    }
  }
}
