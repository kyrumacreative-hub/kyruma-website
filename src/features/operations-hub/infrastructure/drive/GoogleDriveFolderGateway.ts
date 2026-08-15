import {
  DriveReferenceConfigurationError,
  DriveReferenceConflictError,
  DriveReferenceSyncError,
} from "../../domain/errors";
import type { DriveFolderGateway } from "../../ports/DriveFolderGateway";

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export interface GoogleDriveFolderGatewayOptions {
  readonly accessToken: string;
  readonly rootFolderId?: string;
  readonly sharedDriveId?: string;
  readonly fetch?: FetchLike;
}

type DriveFile = Readonly<{ id: string; webViewLink?: string }>;

/**
 * Google Drive REST adapter. It uses an immutable Project-derived key in Drive
 * appProperties, so retries resolve the same folder rather than creating one.
 */
export class GoogleDriveFolderGateway implements DriveFolderGateway {
  private readonly fetch: FetchLike;

  constructor(private readonly options: GoogleDriveFolderGatewayOptions) {
    if (!options.accessToken.trim()) throw new DriveReferenceConfigurationError();
    this.fetch = options.fetch ?? fetch;
  }

  static fromEnvironment(environment: NodeJS.ProcessEnv = process.env): GoogleDriveFolderGateway {
    return new GoogleDriveFolderGateway({
      accessToken: environment.GOOGLE_DRIVE_ACCESS_TOKEN ?? "",
      rootFolderId: environment.GOOGLE_DRIVE_ROOT_FOLDER_ID,
      sharedDriveId: environment.GOOGLE_DRIVE_SHARED_DRIVE_ID,
    });
  }

  async ensureProjectFolder(input: {
    readonly projectId: string;
    readonly projectName: string;
    readonly organizationId: string;
    readonly partnerId: string;
    readonly workspaceId: string;
    readonly idempotencyKey: string;
  }): Promise<{ readonly folderId: string; readonly folderUrl: string }> {
    const existing = await this.findByReferenceKey(input.idempotencyKey);
    if (existing.length > 1) throw new DriveReferenceConflictError();
    if (existing.length === 1) return this.folder(existing[0]);

    const response = await this.fetch(this.filesUrl(), {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        name: input.projectName,
        mimeType: "application/vnd.google-apps.folder",
        ...(this.options.rootFolderId ? { parents: [this.options.rootFolderId] } : {}),
        appProperties: {
          kyrumaReferenceKey: input.idempotencyKey,
          kyrumaProjectId: input.projectId,
          kyrumaOrganizationId: input.organizationId,
          kyrumaPartnerId: input.partnerId,
          kyrumaWorkspaceId: input.workspaceId,
        },
      }),
    });
    if (!response.ok) throw new DriveReferenceSyncError();
    const created = await response.json() as Partial<DriveFile>;
    if (!created.id?.trim()) throw new DriveReferenceSyncError();
    return this.folder({ id: created.id, webViewLink: created.webViewLink });
  }

  private async findByReferenceKey(referenceKey: string): Promise<readonly DriveFile[]> {
    const query = encodeURIComponent([
      "mimeType = 'application/vnd.google-apps.folder'",
      `appProperties has { key='kyrumaReferenceKey' and value='${escapeDriveQuery(referenceKey)}' }`,
      "trashed = false",
    ].join(" and "));
    const response = await this.fetch(`${this.filesUrl()}&q=${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.options.accessToken}` },
    });
    if (!response.ok) throw new DriveReferenceSyncError();
    const result = await response.json() as { files?: unknown };
    if (!Array.isArray(result.files)) throw new DriveReferenceSyncError();
    return result.files.filter(isDriveFile);
  }

  private filesUrl(): string {
    const params = new URLSearchParams({
      fields: "files(id,webViewLink)",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });
    if (this.options.sharedDriveId) {
      params.set("corpora", "drive");
      params.set("driveId", this.options.sharedDriveId);
    }
    return `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
  }

  private headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.options.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  private folder(file: DriveFile): { readonly folderId: string; readonly folderUrl: string } {
    return {
      folderId: file.id,
      folderUrl: file.webViewLink ?? `https://drive.google.com/drive/folders/${encodeURIComponent(file.id)}`,
    };
  }
}

function escapeDriveQuery(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function isDriveFile(value: unknown): value is DriveFile {
  return !!value && typeof value === "object" && typeof (value as { id?: unknown }).id === "string";
}
