import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type { Project } from "../domain/project";

export interface ProjectRepository {
  save(project: Project, context: TransactionContext): Promise<void>;
  findById(projectId: string, organizationId: string, context: TransactionContext): Promise<Project | null>;
  findByCorrelationId(correlationId: string, context: TransactionContext): Promise<Project | null>;
}
