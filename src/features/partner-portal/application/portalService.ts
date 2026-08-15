import { authorize } from "../../identity/domain/authorization";
import type { AuthenticatedActor } from "../../identity/domain/types";
import type { PartnerPortalView, PortalScope } from "../domain/types";

export interface PortalReader { read(scope: PortalScope): Promise<PartnerPortalView | null> }

export class PartnerPortalService {
  constructor(private readonly reader: PortalReader) {}
  async get(actor: AuthenticatedActor, scope: PortalScope): Promise<PartnerPortalView> {
    const decision = authorize(actor, { capability: "workspace.read", resource: { ...scope, visibility: "shared" } });
    if (!decision.allowed) throw new Error(`PORTAL_ACCESS_DENIED:${decision.reason}`);
    const view = await this.reader.read(scope);
    if (!view) throw new Error("PORTAL_NOT_FOUND");
    return view;
  }
}

