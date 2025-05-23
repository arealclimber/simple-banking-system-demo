import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { CommandType } from '../enums/command-type.enum';
import { CreateAccountCommand } from './create-account.command';
import { DepositCommand } from './deposit.command';
import { WithdrawCommand } from './withdraw.command';
import { TransferCommand } from './transfer.command';

describe('Commands', () => {
  it('should create a valid CreateAccountCommand', () => {
    const accountId = new AccountId();
    const name = 'Test Account';
    const initialBalance = new Money(100);

    const command = new CreateAccountCommand(accountId, name, initialBalance);

    expect(command.type).toBe(CommandType.CREATE_ACCOUNT);
    expect(command.aggregateId).toBe(accountId);
    expect(command.name).toBe(name);
    expect(command.initialBalance).toBe(initialBalance);
    expect(typeof command.timestamp).toBe('number');
    expect(command.timestamp).toBeGreaterThan(0);
  });

  it('should create a valid DepositCommand', () => {
    const accountId = new AccountId();
    const amount = new Money(50);

    const command = new DepositCommand(accountId, amount);

    expect(command.type).toBe(CommandType.DEPOSIT);
    expect(command.aggregateId).toBe(accountId);
    expect(command.amount).toBe(amount);
    expect(typeof command.timestamp).toBe('number');
    expect(command.timestamp).toBeGreaterThan(0);
  });

  it('should create a valid WithdrawCommand', () => {
    const accountId = new AccountId();
    const amount = new Money(25);

    const command = new WithdrawCommand(accountId, amount);

    expect(command.type).toBe(CommandType.WITHDRAW);
    expect(command.aggregateId).toBe(accountId);
    expect(command.amount).toBe(amount);
    expect(typeof command.timestamp).toBe('number');
    expect(command.timestamp).toBeGreaterThan(0);
  });

  it('should create a valid TransferCommand', () => {
    const sourceAccountId = new AccountId();
    const destinationAccountId = new AccountId();
    const amount = new Money(75);

    const command = new TransferCommand(
      sourceAccountId,
      destinationAccountId,
      amount,
    );

    expect(command.type).toBe(CommandType.TRANSFER);
    expect(command.aggregateId).toBe(sourceAccountId);
    expect(command.destinationAccountId).toBe(destinationAccountId);
    expect(command.amount).toBe(amount);
    expect(typeof command.timestamp).toBe('number');
    expect(command.timestamp).toBeGreaterThan(0);
  });
});
