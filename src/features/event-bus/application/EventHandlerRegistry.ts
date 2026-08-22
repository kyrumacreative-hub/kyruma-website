import { InvalidEventEnvelopeError } from "../domain/errors";
import type { EventHandler, RegisteredHandler } from "../ports/EventBusRepository";

export class EventHandlerRegistry {
  private readonly entries = new Map<string, RegisteredHandler & { implementation: EventHandler }>();
  register(entry: RegisteredHandler & { implementation: EventHandler }): void {
    const key = this.key(entry.consumer, entry.handler, entry.eventType, entry.eventVersion);
    if (this.entries.has(key)) throw new InvalidEventEnvelopeError(`Duplicate event handler ${key}.`);
    this.entries.set(key, entry);
  }
  registrations(): readonly RegisteredHandler[] {
    return [...this.entries.values()].map(({ consumer, handler, eventType, eventVersion }) => ({ consumer, handler, eventType, eventVersion }));
  }
  subscriptions(type: string, version: number): readonly RegisteredHandler[] { return [...this.entries.values()].filter((entry) => entry.eventType === type && entry.eventVersion === version); }
  resolve(consumer: string, handler: string, type: string, version: number): EventHandler | null { return this.entries.get(this.key(consumer, handler, type, version))?.implementation ?? null; }
  private key(consumer: string, handler: string, type: string, version: number): string { return `${consumer}:${handler}:${type}@${version}`; }
}
