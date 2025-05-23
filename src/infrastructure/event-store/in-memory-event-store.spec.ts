import { AccountId } from '../../domain/value-objects/account-id';
import { AccountCreatedEvent } from '../../domain/events/account-created.event';
import { Money } from '../../domain/value-objects/money';
import { MoneyDepositedEvent } from '../../domain/events/money-deposited.event';
import { InMemoryEventStore } from './in-memory-event-store';
import { ConcurrencyError } from './event-store.error';

describe('InMemoryEventStore', () => {
  let eventStore: InMemoryEventStore;
  let accountId: AccountId;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
    accountId = new AccountId();
  });

  it('should return empty array for non-existent aggregate', async () => {
    const events = await eventStore.load(accountId);
    expect(events).toEqual([]);
  });

  it('should append and load events for an aggregate', async () => {
    const event1 = new AccountCreatedEvent(
      accountId,
      'Test Account',
      new Money(100),
      1,
    );
    const event2 = new MoneyDepositedEvent(
      accountId,
      new Money(50),
      Date.now(),
      2,
    );

    await eventStore.append(accountId, 0, [event1]);
    await eventStore.append(accountId, 1, [event2]);

    const events = await eventStore.load(accountId);
    expect(events).toHaveLength(2);
    expect(events[0]).toBe(event1);
    expect(events[1]).toBe(event2);
  });

  it('should throw ConcurrencyError when appending with wrong expected version', async () => {
    const event = new AccountCreatedEvent(
      accountId,
      'Test Account',
      new Money(100),
      1,
    );

    await eventStore.append(accountId, 0, [event]);

    // 嘗試使用錯誤的期望版本（0而不是1）附加事件
    await expect(
      eventStore.append(accountId, 0, [
        new MoneyDepositedEvent(accountId, new Money(50), Date.now(), 2),
      ]),
    ).rejects.toThrow(ConcurrencyError);
  });

  it('should detect version conflicts in sequential operations', async () => {
    const event1 = new AccountCreatedEvent(
      accountId,
      'Test Account',
      new Money(100),
      1,
    );
    const event2 = new MoneyDepositedEvent(
      accountId,
      new Money(50),
      Date.now(),
      2,
    );
    const event3 = new MoneyDepositedEvent(
      accountId,
      new Money(30),
      Date.now(),
      3,
    );

    await eventStore.append(accountId, 0, [event1]);

    // 第一個操作成功
    await eventStore.append(accountId, 1, [event2]);

    // 第二個操作使用過期的版本號（1而不是2），應該失敗
    await expect(eventStore.append(accountId, 1, [event3])).rejects.toThrow(
      ConcurrencyError,
    );

    // 驗證事件流中只有 event1 和 event2
    const events = await eventStore.load(accountId);
    expect(events).toHaveLength(2);
    expect(events[0]).toBe(event1);
    expect(events[1]).toBe(event2);
  });
});
