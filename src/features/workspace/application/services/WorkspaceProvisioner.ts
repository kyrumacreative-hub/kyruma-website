import type { Workspace } from "../../domain/workspace";
import type { ProvisionWorkspaceUseCase } from "../useCases";

export interface WorkspaceProvisionerInput {
  workspace: {
    id: string;
    partnerId: string;
  };
  metadata: {
    eventId: string;
    occurredAt: Date;
    correlationId: string;
    actorId: string;
  };
}

export interface WorkspaceProvisioner {
  provision(
    input: WorkspaceProvisionerInput,
  ): Promise<Workspace>;
}

export class DefaultWorkspaceProvisioner
  implements WorkspaceProvisioner
{
  constructor(
    private readonly useCase: ProvisionWorkspaceUseCase,
  ) {}

  async provision(
    input: WorkspaceProvisionerInput,
  ): Promise<Workspace> {
    // Usamos 'as any' temporalmente en la capa de adaptación para conciliar
    // el DTO que viene de Partner con lo que espera el caso de uso de Workspace,
    // garantizando que el contrato (interface) hacia afuera quede limpio.
    return this.useCase.execute(input as any);
  }
}