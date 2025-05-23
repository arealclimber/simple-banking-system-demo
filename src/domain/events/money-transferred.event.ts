import { AbstractEvent } from './abstract-event';
import { EventType } from '../enums/event-type.enum';
import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import {
  TimestampInMillisecond,
  TimestampUtils,
} from '../types/timestamp.types';

export class MoneyTransferredEvent extends AbstractEvent {
  constructor(
    aggregateId: AccountId,
    public readonly amount: Money,
    public readonly toAccountId: AccountId,
    readonly occurredAt: TimestampInMillisecond = TimestampUtils.now(),
    readonly version: number = 1,
  ) {
    super(EventType.MONEY_TRANSFERRED, aggregateId, occurredAt, version);
  }

  toJSON(): Record<string, unknown> {
    return {
      type: this.type,
      aggregateId: this.aggregateId.toString(),
      amount: this.amount.getValue(),
      toAccountId: this.toAccountId.toString(),
      occurredAt: TimestampUtils.toISOString(this.occurredAt),
      version: this.version,
    };
  }
}
