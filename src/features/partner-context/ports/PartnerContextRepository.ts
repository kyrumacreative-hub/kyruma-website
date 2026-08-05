import type { PartnerContextRecord } from "../domain/types";

/** Future PostgreSQL adapter. It accepts only the approved public Partner identifier. */
export interface PartnerContextRepository {
  findByPartnerPublicId(partnerPublicId: string): Promise<PartnerContextRecord | null>;
}
