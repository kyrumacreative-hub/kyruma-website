const partnerPublicIdPattern = /^KYR-\d{3,}$/;

/** Public navigation identifier, never an authorization credential or primary key. */
export function isPartnerPublicId(value: string) {
  return partnerPublicIdPattern.test(value);
}
