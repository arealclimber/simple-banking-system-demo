import { EventType } from '../enums/event-type.enum';
import { AccountId } from '../value-objects/account-id';

export interface DomainEvent {
  readonly type: EventType;
  readonly aggregateId: AccountId;
  readonly occurredAt: Date;
  readonly version: number;

  toJSON(): Record<string, unknown>;
}
