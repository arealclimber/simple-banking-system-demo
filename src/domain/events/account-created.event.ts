import { EventType } from '../enums/event-type.enum';
import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { AbstractEvent } from './abstract-event';
import {
  TimestampInMillisecond,
  TimestampUtils,
} from '../types/timestamp.types';

export class AccountCreatedEvent extends AbstractEvent {
  constructor(
    aggregateId: AccountId,
    public readonly accountName: string,
    public readonly initialBalance: Money,
    readonly occurredAt: TimestampInMillisecond = TimestampUtils.now(),
    readonly version: number = 1,
  ) {
    super(EventType.ACCOUNT_CREATED, aggregateId, occurredAt, version);
  }

  toJSON(): Record<string, unknown> {
    return {
      type: this.type,
      aggregateId: this.aggregateId.toString(),
      accountName: this.accountName,
      initialBalance: this.initialBalance.getValue(),
      occurredAt: TimestampUtils.toISOString(this.occurredAt),
      version: this.version,
    };
  }
}
