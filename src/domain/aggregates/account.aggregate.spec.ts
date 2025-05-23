import { AccountAggregate } from './account.aggregate';
import { AccountState } from './account-state';
import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { CreateAccountCommand } from '../commands/create-account.command';
import { DepositCommand } from '../commands/deposit.command';
import { WithdrawCommand } from '../commands/withdraw.command';
import { TransferCommand } from '../commands/transfer.command';
import { AccountCreatedEvent } from '../events/account-created.event';
import { MoneyDepositedEvent } from '../events/money-deposited.event';
import { MoneyWithdrawnEvent } from '../events/money-withdrawn.event';
import { MoneyTransferredEvent } from '../events/money-transferred.event';
import { InsufficientFundsError } from '../errors/domain.error';
import { EventType } from '../enums/event-type.enum';
import { TimestampUtils } from '../types/timestamp.types';

describe('AccountAggregate', () => {
  let accountId: AccountId;
  let aggregate: AccountAggregate;

  beforeEach(() => {
    accountId = new AccountId();
    aggregate = new AccountAggregate(new AccountState());
  });

  it('should create an account', () => {
    const name = 'Test Account';
    const initialBalance = new Money(100);
    const command = new CreateAccountCommand(accountId, name, initialBalance);

    const events = aggregate.execute(command);

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(EventType.ACCOUNT_CREATED);

    const event = events[0] as AccountCreatedEvent;
    expect(event.aggregateId).toBe(accountId);
    expect(event.accountName).toBe(name);
    expect(event.initialBalance).toBe(initialBalance);
    expect(event.version).toBe(1);
  });

  it('should deposit money into an account', () => {
    // 先創建帳戶並應用事件
    const account = AccountAggregate.rehydrate([
      new AccountCreatedEvent(
        accountId,
        'Test Account',
        new Money(100),
        TimestampUtils.now(),
        1,
      ),
    ]);

    const amount = new Money(50);
    const command = new DepositCommand(accountId, amount);

    const events = account.execute(command);

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(EventType.MONEY_DEPOSITED);

    const event = events[0] as MoneyDepositedEvent;
    expect(event.aggregateId).toBe(accountId);
    expect(event.amount).toBe(amount);
    expect(event.version).toBe(2);
  });

  it('should withdraw money from an account with sufficient funds', () => {
    // 先創建帳戶並應用事件
    const account = AccountAggregate.rehydrate([
      new AccountCreatedEvent(
        accountId,
        'Test Account',
        new Money(100),
        TimestampUtils.now(),
        1,
      ),
    ]);

    const amount = new Money(50);
    const command = new WithdrawCommand(accountId, amount);

    const events = account.execute(command);

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(EventType.MONEY_WITHDRAWN);

    const event = events[0] as MoneyWithdrawnEvent;
    expect(event.aggregateId).toBe(accountId);
    expect(event.amount).toBe(amount);
    expect(event.version).toBe(2);
  });

  it('should throw InsufficientFundsError when withdrawing more than the balance', () => {
    // 先創建帳戶並應用事件
    const account = AccountAggregate.rehydrate([
      new AccountCreatedEvent(
        accountId,
        'Test Account',
        new Money(50),
        TimestampUtils.now(),
        1,
      ),
    ]);

    const amount = new Money(100);
    const command = new WithdrawCommand(accountId, amount);

    expect(() => account.execute(command)).toThrow(InsufficientFundsError);
  });

  it('should transfer money between accounts with sufficient funds', () => {
    // 先創建帳戶並應用事件
    const account = AccountAggregate.rehydrate([
      new AccountCreatedEvent(
        accountId,
        'Test Account',
        new Money(100),
        TimestampUtils.now(),
        1,
      ),
    ]);

    const destinationAccountId = new AccountId();
    const amount = new Money(50);
    const command = new TransferCommand(
      accountId,
      destinationAccountId,
      amount,
    );

    const events = account.execute(command);

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(EventType.MONEY_TRANSFERRED);

    const event = events[0] as MoneyTransferredEvent;
    expect(event.aggregateId).toBe(accountId);
    expect(event.toAccountId).toBe(destinationAccountId);
    expect(event.amount).toBe(amount);
    expect(event.version).toBe(2);
  });

  it('should throw InsufficientFundsError when transferring more than the balance', () => {
    // 先創建帳戶並應用事件
    const account = AccountAggregate.rehydrate([
      new AccountCreatedEvent(
        accountId,
        'Test Account',
        new Money(50),
        TimestampUtils.now(),
        1,
      ),
    ]);

    const destinationAccountId = new AccountId();
    const amount = new Money(100);
    const command = new TransferCommand(
      accountId,
      destinationAccountId,
      amount,
    );

    expect(() => account.execute(command)).toThrow(InsufficientFundsError);
  });

  it('should correctly rehydrate aggregate from events', () => {
    const initialBalance = new Money(100);
    const depositAmount = new Money(50);
    const withdrawAmount = new Money(30);
    const remainingAmount = new Money(120); // 100 + 50 - 30 = 120
    const timestamp = TimestampUtils.now();

    const events = [
      new AccountCreatedEvent(
        accountId,
        'Test Account',
        initialBalance,
        timestamp,
        1,
      ),
      new MoneyDepositedEvent(accountId, depositAmount, timestamp, 2),
      new MoneyWithdrawnEvent(accountId, withdrawAmount, timestamp, 3),
    ];

    const account = AccountAggregate.rehydrate(events);

    // 測試：先嘗試提取剩餘的全部金額，應該成功
    const withdrawCommand = new WithdrawCommand(accountId, remainingAmount);
    const withdrawEvents = account.execute(withdrawCommand);
    expect(withdrawEvents).toHaveLength(1);
    expect(withdrawEvents[0].type).toBe(EventType.MONEY_WITHDRAWN);

    // 模擬重新加載帳戶狀態，包括上面的提款事件
    const updatedEvents = [
      ...events,
      withdrawEvents[0], // 添加提款事件
    ];

    const updatedAccount = AccountAggregate.rehydrate(updatedEvents);

    // 帳戶餘額現在應為 0，嘗試再次提款應該失敗
    const emptyAccountWithdrawCommand = new WithdrawCommand(
      accountId,
      new Money(1),
    );
    expect(() => updatedAccount.execute(emptyAccountWithdrawCommand)).toThrow(
      InsufficientFundsError,
    );
  });
});
