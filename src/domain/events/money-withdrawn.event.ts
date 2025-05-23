import { EventType } from '../enums/event-type.enum';
import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { AbstractEvent } from './abstract-event';
import {
  TimestampInMillisecond,
  TimestampUtils,
} from '../types/timestamp.types';

export class MoneyWithdrawnEvent extends AbstractEvent {
  constructor(
    readonly aggregateId: AccountId,
    public readonly amount: Money,
    readonly occurredAt: TimestampInMillisecond = TimestampUtils.now(),
    readonly version: number = 1,
  ) {
    super(EventType.MONEY_WITHDRAWN, aggregateId, occurredAt, version);
  }

  toJSON(): Record<string, unknown> {
    return {
      type: this.type,
      aggregateId: this.aggregateId.toString(),
      amount: this.amount.getValue(),
      occurredAt: TimestampUtils.toISOString(this.occurredAt),
      version: this.version,
    };
  }
}
