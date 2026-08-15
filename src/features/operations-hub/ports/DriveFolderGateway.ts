/** Minimal external Drive capability required by Operations Hub. */
export interface DriveFolderGateway {
  ensureProjectFolder(input: {
    readonly projectId: string;
    readonly projectName: string;
    readonly organizationId: string;
    readonly partnerId: string;
    readonly workspaceId: string;
    readonly idempotencyKey: string;
  }): Promise<{ readonly folderId: string; readonly folderUrl: string }>;
}
