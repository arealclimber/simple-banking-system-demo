import { EventType } from '../enums/event-type.enum';
import { DomainEvent } from '../interfaces/event.interface';
import { AccountId } from '../value-objects/account-id';

export abstract class AbstractEvent implements DomainEvent {
  constructor(
    readonly type: EventType,
    readonly aggregateId: AccountId,
    readonly occurredAt: Date = new Date(),
    readonly version: number = 0,
  ) {}

  abstract toJSON(): Record<string, unknown>;
}
