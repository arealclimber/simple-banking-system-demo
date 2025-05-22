import { EventType } from '../enums/event-type.enum';
import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { AbstractEvent } from './abstract-event';

export class MoneyDepositedEvent extends AbstractEvent {
  constructor(
    readonly aggregateId: AccountId,
    readonly amount: Money,
    readonly version: number,
    readonly occurredAt: Date = new Date(),
  ) {
    super(EventType.MONEY_DEPOSITED, aggregateId, occurredAt, version);
  }

  toJSON(): Record<string, unknown> {
    return {
      type: this.type,
      aggregateId: this.aggregateId.toString(),
      amount: this.amount.getValue(),
      version: this.version,
      occurredAt: this.occurredAt.toISOString(),
    };
  }
}
