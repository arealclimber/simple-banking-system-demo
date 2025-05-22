import { DomainEvent } from '../interfaces/event.interface';
import { Money } from '../value-objects/money';
import { AccountCreatedEvent } from '../events/account-created.event';
import { MoneyDepositedEvent } from '../events/money-deposited.event';
import { MoneyWithdrawnEvent } from '../events/money-withdrawn.event';
import { MoneyTransferredEvent } from '../events/money-transferred.event';
import { EventType } from '../enums/event-type.enum';

export class AccountState {
  private name: string = '';
  private balance: Money = Money.zero();
  private version: number = 0;

  getName(): string {
    return this.name;
  }

  getBalance(): Money {
    return this.balance;
  }

  getVersion(): number {
    return this.version;
  }

  mutate(event: DomainEvent): void {
    switch (event.type) {
      case EventType.ACCOUNT_CREATED:
        this.applyAccountCreated(event as AccountCreatedEvent);
        break;
      case EventType.MONEY_DEPOSITED:
        this.applyMoneyDeposited(event as MoneyDepositedEvent);
        break;
      case EventType.MONEY_WITHDRAWN:
        this.applyMoneyWithdrawn(event as MoneyWithdrawnEvent);
        break;
      case EventType.MONEY_TRANSFERRED:
        this.applyMoneyTransferred(event as MoneyTransferredEvent);
        break;
    }
    this.version = event.version;
  }

  private applyAccountCreated(event: AccountCreatedEvent): void {
    this.name = event.name;
    this.balance = event.initialBalance;
  }

  private applyMoneyDeposited(event: MoneyDepositedEvent): void {
    this.balance = this.balance.add(event.amount);
  }

  private applyMoneyWithdrawn(event: MoneyWithdrawnEvent): void {
    this.balance = this.balance.subtract(event.amount);
  }

  private applyMoneyTransferred(event: MoneyTransferredEvent): void {
    this.balance = this.balance.subtract(event.amount);
  }
}
