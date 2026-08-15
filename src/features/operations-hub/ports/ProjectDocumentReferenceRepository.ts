import type { TransactionContext } from "../../lead-lifecycle/ports/TransactionRunner";
import type {
  ProjectDocumentReference,
  ProjectDocumentReferenceScope,
} from "./ProjectDocumentReferencePort";

export interface ProjectDocumentReferenceRepository {
  findByProject(scope: ProjectDocumentReferenceScope, context: TransactionContext): Promise<ProjectDocumentReference | null>;
  beginSync(input: {
    readonly scope: ProjectDocumentReferenceScope;
    readonly idempotencyKey: string;
    readonly now: Date;
  }, context: TransactionContext): Promise<ProjectDocumentReference>;
  completeSync(input: {
    readonly scope: ProjectDocumentReferenceScope;
    readonly idempotencyKey: string;
    readonly externalReference: string;
    readonly externalUrl: string;
    readonly now: Date;
  }, context: TransactionContext): Promise<ProjectDocumentReference>;
  failSync(input: {
    readonly scope: ProjectDocumentReferenceScope;
    readonly idempotencyKey: string;
    readonly error: string;
    readonly now: Date;
  }, context: TransactionContext): Promise<ProjectDocumentReference>;
  listByProject(scope: ProjectDocumentReferenceScope, context: TransactionContext): Promise<readonly ProjectDocumentReference[]>;
}
