import { AuditEvent } from "../../domain/AuditEvent";
import type { AuditEventPersistenceModel } from "./models";
export const AuditEventMapper = {
  toPersistence: (event: AuditEvent): AuditEventPersistenceModel => ({ ...event.properties }),
  toDomain: (model: AuditEventPersistenceModel): AuditEvent => new AuditEvent({ ...model }),
};
