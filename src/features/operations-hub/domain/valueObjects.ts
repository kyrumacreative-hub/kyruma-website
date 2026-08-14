import { InvalidProjectStateError, InvalidProjectValueError } from "./errors";

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new InvalidProjectValueError(`${field} is required.`);
  return normalized;
}

export class ProjectId {
  private constructor(readonly value: string) {}
  static create(value: string) { return new ProjectId(required(value, "Project id")); }
}

export class OperationsWorkspaceId {
  private constructor(readonly value: string) {}
  static create(value: string) { return new OperationsWorkspaceId(required(value, "Workspace id")); }
}

export class OperationsPartnerId {
  private constructor(readonly value: string) {}
  static create(value: string) { return new OperationsPartnerId(required(value, "Partner id")); }
}

export class OperationsOrganizationId {
  private constructor(readonly value: string) {}
  static create(value: string) { return new OperationsOrganizationId(required(value, "Organization id")); }
}

export class ProjectName {
  private constructor(readonly value: string) {}
  static create(value: string) {
    const normalized = required(value, "Project name");
    if (normalized.length > 160) throw new InvalidProjectValueError("Project name is too long.");
    return new ProjectName(normalized);
  }
}

export const projectStatuses = ["planned", "active", "on_hold", "completed", "cancelled"] as const;
export type ProjectStatusValue = (typeof projectStatuses)[number];

export class ProjectStatus {
  private constructor(readonly value: ProjectStatusValue) {}
  static create(value: string) {
    if (!projectStatuses.includes(value as ProjectStatusValue)) {
      throw new InvalidProjectStateError(`Unsupported Project status: ${value}`);
    }
    return new ProjectStatus(value as ProjectStatusValue);
  }
  static planned() { return new ProjectStatus("planned"); }
}
