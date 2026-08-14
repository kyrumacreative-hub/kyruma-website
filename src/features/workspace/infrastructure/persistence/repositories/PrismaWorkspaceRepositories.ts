import { Prisma } from "@prisma/client";

import { PrismaTransactionContextStore } from "../../../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import type { TransactionContext } from "../../../../lead-lifecycle/ports/TransactionRunner";

import type {
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceSettings,
} from "../../../domain/entities";
import type { Workspace } from "../../../domain/workspace";
import type {
  WorkspaceInvitationRepository,
  WorkspaceMemberRepository,
  WorkspaceRepository,
  WorkspaceSettingsRepository,
} from "../../../ports/repositories";

import {
  WorkspaceInvitationMapper,
  WorkspaceMapper,
  WorkspaceMemberMapper,
  WorkspaceSettingsMapper,
} from "../mappers";
import type {
  WorkspaceInvitationPersistenceModel,
  WorkspaceMemberPersistenceModel,
  WorkspacePersistenceModel,
  WorkspaceSettingsPersistenceModel,
} from "../models";

export class PrismaWorkspaceRepository implements WorkspaceRepository {
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(
    workspace: Workspace,
    context: TransactionContext,
  ): Promise<void> {
    const transaction = this.contexts.get(context);

    const workspaceModel = WorkspaceMapper.toPersistence(workspace);

    await transaction.workspace.create({
      data: toWorkspaceCreateRecord(workspaceModel),
    });

    const settingsModel = WorkspaceSettingsMapper.toPersistence(
      workspace.settings,
      workspace.id.value,
    );

    await transaction.workspaceSettings.create({
      data: toWorkspaceSettingsCreateRecord(settingsModel),
    });

    const memberModel = WorkspaceMemberMapper.toPersistence(
      workspace.initialOwner,
      workspace.id.value,
    );

    await transaction.workspaceMember.create({
      data: toWorkspaceMemberCreateRecord(memberModel),
    });
  }

  async update(
    workspace: Workspace,
    context: TransactionContext,
  ): Promise<void> {
    const model = WorkspaceMapper.toPersistence(workspace);

    await this.contexts.get(context).workspace.update({
      where: { id: model.id },
      data: toWorkspaceUpdateRecord(model),
    });
  }

  async findById(
    workspaceId: string,
    context: TransactionContext,
  ): Promise<Workspace | null> {
    const transaction = this.contexts.get(context);

    const record = await transaction.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!record) {
      return null;
    }

    return this.restoreWorkspace(
      fromWorkspaceRecord(record),
      context,
    );
  }

  async findPrimaryByPartner(
    partnerId: string,
    context: TransactionContext,
  ): Promise<Workspace | null> {
    const transaction = this.contexts.get(context);

    const record = await transaction.workspace.findFirst({
      where: {
        partnerId,
        primary: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!record) {
      return null;
    }

    return this.restoreWorkspace(
      fromWorkspaceRecord(record),
      context,
    );
  }

  async findByCorrelationId(
    correlationId: string,
    context: TransactionContext,
  ): Promise<Workspace | null> {
    const transaction = this.contexts.get(context);

    const record = await transaction.workspace.findUnique({
      where: { correlationId },
    });

    if (!record) {
      return null;
    }

    return this.restoreWorkspace(
      fromWorkspaceRecord(record),
      context,
    );
  }

  private async restoreWorkspace(
    model: WorkspacePersistenceModel,
    context: TransactionContext,
  ): Promise<Workspace | null> {
    const transaction = this.contexts.get(context);

    const settingsRecord =
      await transaction.workspaceSettings.findUnique({
        where: {
          workspaceId: model.id,
        },
      });

    if (!settingsRecord) {
      return null;
    }

    const settings = WorkspaceSettingsMapper.toDomain(
      fromWorkspaceSettingsRecord(settingsRecord),
    );

    return WorkspaceMapper.toDomain(model, settings);
  }
}

export class PrismaWorkspaceInvitationRepository
  implements WorkspaceInvitationRepository
{
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(
    invitation: WorkspaceInvitation,
    workspaceId: string,
    context: TransactionContext,
  ): Promise<void> {
    const model = WorkspaceInvitationMapper.toPersistence(
      invitation,
      workspaceId,
    );

    await this.contexts.get(context).workspaceInvitation.create({
      data: toWorkspaceInvitationCreateRecord(model),
    });
  }

  async update(
    invitation: WorkspaceInvitation,
    context: TransactionContext,
  ): Promise<void> {
    const transaction = this.contexts.get(context);

    await transaction.workspaceInvitation.update({
      where: {
        id: invitation.id.value,
      },
      data: {
        recipientReference: invitation.recipientReference.value,
        intendedRole: invitation.intendedRole.value,
        tokenHash: invitation.tokenHash.value,
        expiresAt: invitation.expiry.value,
        status: invitation.status,
        createdAt: invitation.createdAt,
        acceptedAt: invitation.acceptedAt ?? null,
        revokedAt: invitation.revokedAt ?? null,
        correlationId: invitation.correlationId.value,
      },
    });
  }

  async findById(
    invitationId: string,
    context: TransactionContext,
  ): Promise<WorkspaceInvitation | null> {
    const record =
      await this.contexts.get(context).workspaceInvitation.findUnique({
        where: {
          id: invitationId,
        },
      });

    return record
      ? WorkspaceInvitationMapper.toDomain(
          fromWorkspaceInvitationRecord(record),
        )
      : null;
  }
}

export class PrismaWorkspaceMemberRepository
  implements WorkspaceMemberRepository
{
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(
    member: WorkspaceMember,
    workspaceId: string,
    context: TransactionContext,
  ): Promise<void> {
    const model = WorkspaceMemberMapper.toPersistence(
      member,
      workspaceId,
    );

    await this.contexts.get(context).workspaceMember.create({
      data: toWorkspaceMemberCreateRecord(model),
    });
  }

  async update(
    member: WorkspaceMember,
    context: TransactionContext,
  ): Promise<void> {
    await this.contexts.get(context).workspaceMember.update({
      where: {
        id: member.id.value,
      },
      data: {
        membershipId: member.membershipId.value,
        owner: member.owner,
        status: member.status,
        joinedAt: member.joinedAt,
        removedAt: member.removedAt ?? null,
      },
    });
  }

  async findByMembershipId(
    workspaceId: string,
    membershipId: string,
    context: TransactionContext,
  ): Promise<WorkspaceMember | null> {
    const record =
      await this.contexts.get(context).workspaceMember.findUnique({
        where: {
          workspaceId_membershipId: {
            workspaceId,
            membershipId,
          },
        },
      });

    return record
      ? WorkspaceMemberMapper.toDomain(
          fromWorkspaceMemberRecord(record),
        )
      : null;
  }

  async listActive(
    workspaceId: string,
    context: TransactionContext,
  ): Promise<WorkspaceMember[]> {
    const records =
      await this.contexts.get(context).workspaceMember.findMany({
        where: {
          workspaceId,
          status: "active",
        },
        orderBy: {
          joinedAt: "asc",
        },
      });

    return records.map((record) =>
      WorkspaceMemberMapper.toDomain(
        fromWorkspaceMemberRecord(record),
      ),
    );
  }
}

export class PrismaWorkspaceSettingsRepository
  implements WorkspaceSettingsRepository
{
  constructor(private readonly contexts: PrismaTransactionContextStore) {}

  async save(
    settings: WorkspaceSettings,
    workspaceId: string,
    context: TransactionContext,
  ): Promise<void> {
    const model = WorkspaceSettingsMapper.toPersistence(
      settings,
      workspaceId,
    );

    await this.contexts.get(context).workspaceSettings.upsert({
      where: {
        workspaceId,
      },
      create: toWorkspaceSettingsCreateRecord(model),
      update: {
        version: model.version,
        values: model.values as Prisma.InputJsonValue,
      },
    });
  }

  async findCurrent(
    workspaceId: string,
    context: TransactionContext,
  ): Promise<WorkspaceSettings | null> {
    const record =
      await this.contexts.get(context).workspaceSettings.findUnique({
        where: {
          workspaceId,
        },
      });

    return record
      ? WorkspaceSettingsMapper.toDomain(
          fromWorkspaceSettingsRecord(record),
        )
      : null;
  }
}

function toWorkspaceCreateRecord(
  model: WorkspacePersistenceModel,
): Prisma.WorkspaceUncheckedCreateInput {
  return {
    id: model.id,
    partnerId: model.partnerId,
    organizationId: model.organizationId,
    name: model.name,
    primary: model.primary,
    status: model.status,
    initialOwnerMemberId: model.initialOwnerMemberId,
    initialOwnerMembershipId: model.initialOwnerMembershipId,
    settingsVersion: model.settingsVersion,
    createdAt: model.createdAt,
    correlationId: model.correlationId,
  };
}

function toWorkspaceUpdateRecord(
  model: WorkspacePersistenceModel,
): Prisma.WorkspaceUncheckedUpdateInput {
  return {
    partnerId: model.partnerId,
    organizationId: model.organizationId,
    name: model.name,
    primary: model.primary,
    status: model.status,
    initialOwnerMemberId: model.initialOwnerMemberId,
    initialOwnerMembershipId: model.initialOwnerMembershipId,
    settingsVersion: model.settingsVersion,
    createdAt: model.createdAt,
    correlationId: model.correlationId,
  };
}

function fromWorkspaceRecord(
  record: Prisma.WorkspaceGetPayload<Record<string, never>>,
): WorkspacePersistenceModel {
  return {
    id: record.id,
    partnerId: record.partnerId,
    organizationId: record.organizationId,
    name: record.name,
    primary: record.primary,
    status: record.status,
    initialOwnerMemberId: record.initialOwnerMemberId,
    initialOwnerMembershipId: record.initialOwnerMembershipId,
    settingsVersion: record.settingsVersion,
    createdAt: record.createdAt,
    correlationId: record.correlationId,
  };
}

function toWorkspaceMemberCreateRecord(
  model: WorkspaceMemberPersistenceModel,
): Prisma.WorkspaceMemberUncheckedCreateInput {
  return {
    id: model.id,
    workspaceId: model.workspaceId,
    membershipId: model.membershipId,
    owner: model.owner,
    status: model.status,
    joinedAt: model.joinedAt,
    removedAt: model.removedAt ?? null,
  };
}

function fromWorkspaceMemberRecord(
  record: Prisma.WorkspaceMemberGetPayload<Record<string, never>>,
): WorkspaceMemberPersistenceModel {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    membershipId: record.membershipId,
    owner: record.owner,
    status: record.status as "active" | "removed",
    joinedAt: record.joinedAt,
    removedAt: record.removedAt ?? undefined,
  };
}

function toWorkspaceInvitationCreateRecord(
  model: WorkspaceInvitationPersistenceModel,
): Prisma.WorkspaceInvitationUncheckedCreateInput {
  return {
    id: model.id,
    workspaceId: model.workspaceId,
    recipientReference: model.recipientReference,
    intendedRole: model.intendedRole,
    tokenHash: model.tokenHash,
    expiresAt: model.expiresAt,
    status: model.status,
    createdAt: model.createdAt,
    acceptedAt: model.acceptedAt ?? null,
    revokedAt: model.revokedAt ?? null,
    correlationId: model.correlationId,
  };
}

function fromWorkspaceInvitationRecord(
  record: Prisma.WorkspaceInvitationGetPayload<Record<string, never>>,
): WorkspaceInvitationPersistenceModel {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    recipientReference: record.recipientReference,
    intendedRole: record.intendedRole,
    tokenHash: record.tokenHash,
    expiresAt: record.expiresAt,
    status: record.status,
    createdAt: record.createdAt,
    acceptedAt: record.acceptedAt ?? undefined,
    revokedAt: record.revokedAt ?? undefined,
    correlationId: record.correlationId,
  };
}

function toWorkspaceSettingsCreateRecord(
  model: WorkspaceSettingsPersistenceModel,
): Prisma.WorkspaceSettingsUncheckedCreateInput {
  return {
    workspaceId: model.workspaceId,
    version: model.version,
    values: model.values as Prisma.InputJsonValue,
  };
}

function fromWorkspaceSettingsRecord(
  record: Prisma.WorkspaceSettingsGetPayload<Record<string, never>>,
): WorkspaceSettingsPersistenceModel {
  return {
    workspaceId: record.workspaceId,
    version: record.version,
    values: record.values as Record<string, unknown>,
  };
}