import { Partner, type PartnerProperties } from "./partner";
export class PartnerFactory { static create(properties: PartnerProperties) { return new Partner(properties); } }
