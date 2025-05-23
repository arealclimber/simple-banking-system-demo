import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { EventType } from '../enums/event-type.enum';
import { AccountCreatedEvent } from './account-created.event';
import { MoneyDepositedEvent } from './money-deposited.event';
import { MoneyWithdrawnEvent } from './money-withdrawn.event';
import { MoneyTransferredEvent } from './money-transferred.event';
import { TimestampUtils } from '../types/timestamp.types';

describe('Events', () => {
  it('should create a valid AccountCreatedEvent', () => {
    const accountId = new AccountId();
    const name = 'Test Account';
    const initialBalance = new Money(100);
    const timestamp = TimestampUtils.now();
    const version = 1;

    const event = new AccountCreatedEvent(
      accountId,
      name,
      initialBalance,
      timestamp,
      version,
    );

    expect(event.type).toBe(EventType.ACCOUNT_CREATED);
    expect(event.aggregateId).toBe(accountId);
    expect(event.accountName).toBe(name);
    expect(event.initialBalance).toBe(initialBalance);
    expect(event.version).toBe(version);
    expect(typeof event.occurredAt).toBe('number');
    expect(event.occurredAt).toBe(timestamp);

    const json = event.toJSON();
    expect(json.type).toBe(EventType.ACCOUNT_CREATED);
    expect(json.aggregateId).toBe(accountId.toString());
    expect(json.accountName).toBe(name);
    expect(json.initialBalance).toBe(initialBalance.getValue());
    expect(json.version).toBe(version);
    expect(typeof json.occurredAt).toBe('string');
  });

  it('should create a valid MoneyDepositedEvent', () => {
    const accountId = new AccountId();
    const amount = new Money(50);
    const timestamp = TimestampUtils.now();
    const version = 2;

    const event = new MoneyDepositedEvent(
      accountId,
      amount,
      timestamp,
      version,
    );

    expect(event.type).toBe(EventType.MONEY_DEPOSITED);
    expect(event.aggregateId).toBe(accountId);
    expect(event.amount).toBe(amount);
    expect(event.version).toBe(version);
    expect(typeof event.occurredAt).toBe('number');
    expect(event.occurredAt).toBe(timestamp);

    const json = event.toJSON();
    expect(json.type).toBe(EventType.MONEY_DEPOSITED);
    expect(json.aggregateId).toBe(accountId.toString());
    expect(json.amount).toBe(amount.getValue());
    expect(json.version).toBe(version);
  });

  it('should create a valid MoneyWithdrawnEvent', () => {
    const accountId = new AccountId();
    const amount = new Money(30);
    const timestamp = TimestampUtils.now();
    const version = 3;

    const event = new MoneyWithdrawnEvent(
      accountId,
      amount,
      timestamp,
      version,
    );

    expect(event.type).toBe(EventType.MONEY_WITHDRAWN);
    expect(event.aggregateId).toBe(accountId);
    expect(event.amount).toBe(amount);
    expect(event.version).toBe(version);
    expect(typeof event.occurredAt).toBe('number');
    expect(event.occurredAt).toBe(timestamp);

    const json = event.toJSON();
    expect(json.type).toBe(EventType.MONEY_WITHDRAWN);
    expect(json.aggregateId).toBe(accountId.toString());
    expect(json.amount).toBe(amount.getValue());
    expect(json.version).toBe(version);
  });

  it('should create a valid MoneyTransferredEvent', () => {
    const sourceAccountId = new AccountId();
    const destinationAccountId = new AccountId();
    const amount = new Money(20);
    const timestamp = TimestampUtils.now();
    const version = 4;

    const event = new MoneyTransferredEvent(
      sourceAccountId,
      amount,
      destinationAccountId,
      timestamp,
      version,
    );

    expect(event.type).toBe(EventType.MONEY_TRANSFERRED);
    expect(event.aggregateId).toBe(sourceAccountId);
    expect(event.toAccountId).toBe(destinationAccountId);
    expect(event.amount).toBe(amount);
    expect(event.version).toBe(version);
    expect(typeof event.occurredAt).toBe('number');
    expect(event.occurredAt).toBe(timestamp);

    const json = event.toJSON();
    expect(json.type).toBe(EventType.MONEY_TRANSFERRED);
    expect(json.aggregateId).toBe(sourceAccountId.toString());
    expect(json.toAccountId).toBe(destinationAccountId.toString());
    expect(json.amount).toBe(amount.getValue());
    expect(json.version).toBe(version);
  });
});
