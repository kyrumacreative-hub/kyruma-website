/** Direct access provisioning is a legacy administrative exception, never a production path. */
export function assertDirectPartnerProvisioningAllowed(environment: {
  NODE_ENV?: string;
  KYRUMA_ALLOW_DIRECT_PARTNER_PROVISIONING?: string;
}): void {
  if (
    environment.NODE_ENV === "production" ||
    environment.KYRUMA_ALLOW_DIRECT_PARTNER_PROVISIONING !== "true"
  ) {
    throw new Error("ACCESS_DIRECT_PROVISIONING_DISABLED");
  }
}
