import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { Project } from "../domain/project";
import type { ProjectStatusValue } from "../domain/valueObjects";

export interface ProjectRepository {
  save(project: Project, context: TransactionContext): Promise<void>;
  /**
   * Persists one lifecycle transition only when the stored status still matches
   * the status observed by the application service. This is the minimum
   * provider-independent concurrency boundary for Project transitions.
   */
  update(project: Project, expectedStatus: ProjectStatusValue, context: TransactionContext): Promise<void>;
  findById(projectId: string, organizationId: string, context: TransactionContext): Promise<Project | null>;
  findByCorrelationId(correlationId: string, context: TransactionContext): Promise<Project | null>;
}
