export class EventBusError extends Error { constructor(readonly code: string, message: string) { super(message); } }
export class InvalidEventEnvelopeError extends EventBusError { constructor(message: string) { super("INVALID_EVENT_ENVELOPE", message); } }
export class UnsupportedEventContractError extends EventBusError { constructor(type: string, version: number) { super("UNSUPPORTED_EVENT_CONTRACT", `Unsupported event contract ${type}@${version}.`); } }
export class EventLoopDetectedError extends EventBusError { constructor() { super("EVENT_LOOP_DETECTED", "Event processing depth exceeds the approved limit."); } }
export class EventNotFoundError extends EventBusError { constructor() { super("EVENT_NOT_FOUND", "The event is not available in this organization."); } }
export class DeadLetterRequiredError extends EventBusError { constructor() { super("DEAD_LETTER_REQUIRED", "Only dead-lettered deliveries can be reprocessed."); } }
export class NonRetryableEventError extends EventBusError { constructor(code: string, message: string) { super(code, message); } }
