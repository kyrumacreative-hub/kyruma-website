import type { LeadLifecycleApiDependencies } from "./contracts";
import { InfrastructureNotConfiguredError } from "./errors";
import { LeadLifecycleController } from "./controller";

const required: (keyof LeadLifecycleApiDependencies)[] = [
  "contextAdapter", "operationMetadata", "createLead", "getLead", "updateLead", "archiveLead", "reactivateLead", "changeOwner", "ownershipHistory", "startDiscovery", "discoveryStatus", "startQualification", "completeQualification", "createPartner",
];

/** Composition boundary for a future internal server. It fails closed until real adapters exist. */
export function composeLeadLifecycleApi(dependencies: Partial<LeadLifecycleApiDependencies>): LeadLifecycleController {
  const missing = required.filter((key) => !dependencies[key]);
  if (missing.length) throw new InfrastructureNotConfiguredError(`Lead Lifecycle API dependencies are not configured: ${missing.join(", ")}.`);
  return new LeadLifecycleController({
    contextAdapter: dependencies.contextAdapter!, operationMetadata: dependencies.operationMetadata!,
    createLead: dependencies.createLead!, getLead: dependencies.getLead!, updateLead: dependencies.updateLead!, archiveLead: dependencies.archiveLead!, reactivateLead: dependencies.reactivateLead!,
    changeOwner: dependencies.changeOwner!, ownershipHistory: dependencies.ownershipHistory!, startDiscovery: dependencies.startDiscovery!, discoveryStatus: dependencies.discoveryStatus!,
    startQualification: dependencies.startQualification!, completeQualification: dependencies.completeQualification!, createPartner: dependencies.createPartner!,
  });
}
