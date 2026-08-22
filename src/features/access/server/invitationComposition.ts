import { EventHandlerRegistry } from "../../event-bus/application/EventHandlerRegistry";
import { DispatchPendingEventsUseCase, ProcessEventUseCase } from "../../event-bus/application/useCases";
import { PrismaEventBusRepository } from "../../event-bus/infrastructure/persistence/PrismaEventBusRepository";
import { PostgresEventTransport } from "../../event-bus/infrastructure/persistence/PostgresEventTransport";
import { PrismaTransactionContextStore } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionContext";
import { PrismaTransactionRunner } from "../../lead-lifecycle/infrastructure/persistence/PrismaTransactionRunner";
import { PrismaAuditRepository } from "../../audit/infrastructure/persistence/PrismaAuditRepository";
import { prisma } from "../../../lib/prisma";
import { DeliverPartnerInvitationHandler } from "../application/DeliverPartnerInvitationHandler";
import { InviteUserUseCase } from "../application/InviteUserUseCase";
import { AccessInvitationAuditAdapter, AccessInvitationEventAdapter, PARTNER_INVITATION_REQUESTED } from "../infrastructure/AccessInvitationOutboxAdapters";
import { ClerkAccessInvitationDelivery } from "../infrastructure/ClerkAccessInvitationDelivery";
import { HmacInvitationTokenFactory } from "../infrastructure/HmacInvitationTokenFactory";
import { PrismaAccessInvitationRepository } from "../infrastructure/PrismaAccessInvitationRepository";

function tokenFactory(): HmacInvitationTokenFactory {
  return new HmacInvitationTokenFactory({ 1: process.env.ACCESS_INVITATION_TOKEN_SECRET ?? "" });
}

function publicOrigin(): string {
  const configured = process.env.APP_URL
    ?? process.env.NEXT_PUBLIC_APP_URL
    ?? (process.env.NODE_ENV === "production" ? "https://www.kyruma.com" : "http://localhost:3000");
  const origin = new URL(configured);
  if (origin.protocol !== "http:" && origin.protocol !== "https:") throw new Error("APP_URL must use http or https.");
  if (process.env.NODE_ENV === "production" && origin.protocol !== "https:") throw new Error("APP_URL must use https in production.");
  return origin.origin;
}

function foundation() {
  const contexts = new PrismaTransactionContextStore();
  const transactions = new PrismaTransactionRunner(prisma, contexts);
  const invitations = new PrismaAccessInvitationRepository(prisma, contexts);
  const events = new PrismaEventBusRepository(prisma, contexts);
  return { contexts, transactions, invitations, events };
}

export function createInvitePartnerUseCase(): InviteUserUseCase {
  const value = foundation();
  return new InviteUserUseCase({ transactions: value.transactions, repository: value.invitations, audit: new AccessInvitationAuditAdapter(new PrismaAuditRepository(prisma, value.contexts)), events: new AccessInvitationEventAdapter(value.events), tokens: tokenFactory() });
}

export function createInvitationWorker(): { dispatch: DispatchPendingEventsUseCase; process: ProcessEventUseCase } {
  const value = foundation(); const handlers = new EventHandlerRegistry();
  const audit = new AccessInvitationAuditAdapter(new PrismaAuditRepository(prisma, value.contexts));
  handlers.register({ consumer: "access", handler: "deliver-partner-invitation", eventType: PARTNER_INVITATION_REQUESTED, eventVersion: 1, implementation: new DeliverPartnerInvitationHandler(value.invitations, new ClerkAccessInvitationDelivery(), tokenFactory(), value.transactions, audit, publicOrigin()) });
  const clock = { now: () => new Date() };
  return { dispatch: new DispatchPendingEventsUseCase(value.events, new PostgresEventTransport(value.events), handlers, clock), process: new ProcessEventUseCase(value.events, handlers, value.transactions, clock) };
}
