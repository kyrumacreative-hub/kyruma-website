export interface InvitationTokenFactory {
  create(invitationId: string, version: number): string;
}
