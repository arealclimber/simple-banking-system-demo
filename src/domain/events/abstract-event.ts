import { EventType } from '../enums/event-type.enum';
import { DomainEvent } from '../interfaces/event.interface';
import { AccountId } from '../value-objects/account-id';
import {
  TimestampInMillisecond,
  TimestampUtils,
} from '../types/timestamp.types';

export abstract class AbstractEvent implements DomainEvent {
  constructor(
    public readonly type: EventType,
    public readonly aggregateId: AccountId,
    public readonly occurredAt: TimestampInMillisecond = TimestampUtils.now(),
    public readonly version: number = 1,
  ) {}

  abstract toJSON(): Record<string, unknown>;
}
