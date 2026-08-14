/**
 * Future boundary for a document system such as Google Drive. Operations stores
 * only the resource reference; storage providers and file contents stay outside
 * this bounded context.
 */
export interface ProjectDocumentReferencePort {
  listByProject(projectId: string): Promise<readonly { documentId: string; externalReference?: string }[]>;
}
