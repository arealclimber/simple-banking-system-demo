import { EventType } from '../enums/event-type.enum';
import { AccountId } from '../value-objects/account-id';
import { TimestampInMillisecond } from '../types/timestamp.types';

export interface DomainEvent {
  readonly type: EventType;
  readonly aggregateId: AccountId;
  readonly occurredAt: TimestampInMillisecond;
  readonly version: number;

  toJSON(): Record<string, unknown>;
}
