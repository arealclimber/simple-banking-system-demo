import { EventType } from '../enums/event-type.enum';
import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { AbstractEvent } from './abstract-event';

export class AccountCreatedEvent extends AbstractEvent {
  constructor(
    readonly aggregateId: AccountId,
    readonly name: string,
    readonly initialBalance: Money,
    readonly version: number,
    readonly occurredAt: Date = new Date(),
  ) {
    super(EventType.ACCOUNT_CREATED, aggregateId, occurredAt, version);
  }

  toJSON(): Record<string, unknown> {
    return {
      type: this.type,
      aggregateId: this.aggregateId.toString(),
      name: this.name,
      initialBalance: this.initialBalance.getValue(),
      version: this.version,
      occurredAt: this.occurredAt.toISOString(),
    };
  }
}
