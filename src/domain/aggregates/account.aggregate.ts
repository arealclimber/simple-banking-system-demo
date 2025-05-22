import { Command } from '../interfaces/command.interface';
import { DomainEvent } from '../interfaces/event.interface';
import { CommandType } from '../enums/command-type.enum';
import { CreateAccountCommand } from '../commands/create-account.command';
import { DepositCommand } from '../commands/deposit.command';
import { WithdrawCommand } from '../commands/withdraw.command';
import { TransferCommand } from '../commands/transfer.command';
import { AccountCreatedEvent } from '../events/account-created.event';
import { MoneyDepositedEvent } from '../events/money-deposited.event';
import { MoneyWithdrawnEvent } from '../events/money-withdrawn.event';
import { MoneyTransferredEvent } from '../events/money-transferred.event';
import { AccountState } from './account-state';
import {
  InsufficientFundsError,
  InvalidOperationError,
} from '../errors/domain.error';
import { Money } from '../value-objects/money';

export class AccountAggregate {
  constructor(private state: AccountState) {}

  static rehydrate(events: DomainEvent[]): AccountAggregate {
    const state = new AccountState();
    events.forEach((event) => state.mutate(event));
    return new AccountAggregate(state);
  }

  execute(command: Command): DomainEvent[] {
    switch (command.type) {
      case CommandType.CREATE_ACCOUNT:
        return this.handleCreateAccount(command as CreateAccountCommand);
      case CommandType.DEPOSIT:
        return this.handleDeposit(command as DepositCommand);
      case CommandType.WITHDRAW:
        return this.handleWithdraw(command as WithdrawCommand);
      case CommandType.TRANSFER:
        return this.handleTransfer(command as TransferCommand);
      default:
        throw new InvalidOperationError('Unknown command type');
    }
  }

  private handleCreateAccount(command: CreateAccountCommand): DomainEvent[] {
    const event = new AccountCreatedEvent(
      command.aggregateId,
      command.name,
      command.initialBalance,
      this.state.getVersion() + 1,
      command.timestamp,
    );
    return [event];
  }

  private handleDeposit(command: DepositCommand): DomainEvent[] {
    const event = new MoneyDepositedEvent(
      command.aggregateId,
      command.amount,
      this.state.getVersion() + 1,
      command.timestamp,
    );
    return [event];
  }

  private handleWithdraw(command: WithdrawCommand): DomainEvent[] {
    this.guardSufficientFunds(command.amount);

    const event = new MoneyWithdrawnEvent(
      command.aggregateId,
      command.amount,
      this.state.getVersion() + 1,
      command.timestamp,
    );
    return [event];
  }

  private handleTransfer(command: TransferCommand): DomainEvent[] {
    this.guardSufficientFunds(command.amount);

    const event = new MoneyTransferredEvent(
      command.aggregateId,
      command.destinationAccountId,
      command.amount,
      this.state.getVersion() + 1,
      command.timestamp,
    );
    return [event];
  }

  private guardSufficientFunds(amount: Money): void {
    if (!this.state.getBalance().isGreaterThanOrEqual(amount)) {
      throw new InsufficientFundsError();
    }
  }
}
