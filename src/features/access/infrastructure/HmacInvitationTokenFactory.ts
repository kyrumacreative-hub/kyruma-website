import { createHmac } from "node:crypto";
import type { InvitationTokenFactory } from "../ports/InvitationTokenFactory";

export class HmacInvitationTokenFactory implements InvitationTokenFactory {
  constructor(private readonly secrets: Readonly<Record<number, string>>) {}

  create(invitationId: string, version: number): string {
    const secret = this.secrets[version];
    if (!secret || secret.length < 32) throw new Error(`ACCESS_INVITATION_TOKEN_SECRET_V${version}_INVALID`);
    return `v${version}.${createHmac("sha256", secret).update(`access-invitation:${invitationId}`, "utf8").digest("base64url")}`;
  }
}
