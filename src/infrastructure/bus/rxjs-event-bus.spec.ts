import { AccountId } from '../../domain/value-objects/account-id';
import { Money } from '../../domain/value-objects/money';
import { AccountCreatedEvent } from '../../domain/events/account-created.event';
import { MoneyDepositedEvent } from '../../domain/events/money-deposited.event';
import { RxjsEventBus } from './rxjs-event-bus';

describe('RxjsEventBus', () => {
  let eventBus: RxjsEventBus;
  let accountId: AccountId;

  beforeEach(() => {
    eventBus = new RxjsEventBus();
    accountId = new AccountId();
  });

  it('should publish and subscribe to events', () => {
    const accountCreatedHandler = jest.fn();
    const moneyDepositedHandler = jest.fn();
    const anyEventHandler = jest.fn();

    // 訂閱特定事件類型
    eventBus.subscribe('AccountCreated', accountCreatedHandler);
    eventBus.subscribe('MoneyDeposited', moneyDepositedHandler);

    // 建立事件
    const accountCreatedEvent = new AccountCreatedEvent(
      accountId,
      'Test Account',
      new Money(100),
      1,
    );
    const moneyDepositedEvent = new MoneyDepositedEvent(
      accountId,
      new Money(50),
      2,
    );

    // 發布事件
    eventBus.publish([accountCreatedEvent, moneyDepositedEvent]);

    // 驗證處理器被調用
    expect(accountCreatedHandler).toHaveBeenCalledWith(accountCreatedEvent);
    expect(moneyDepositedHandler).toHaveBeenCalledWith(moneyDepositedEvent);
    expect(anyEventHandler).not.toHaveBeenCalled();
  });

  it('should allow unsubscribing from events', () => {
    const handler = jest.fn();

    // 訂閱事件
    const unsubscribe = eventBus.subscribe('AccountCreated', handler);

    // 建立事件
    const event = new AccountCreatedEvent(
      accountId,
      'Test Account',
      new Money(100),
      1,
    );

    // 發布事件
    eventBus.publish([event]);
    expect(handler).toHaveBeenCalledTimes(1);

    // 取消訂閱
    unsubscribe();

    // 再次發布事件
    eventBus.publish([event]);
    expect(handler).toHaveBeenCalledTimes(1); // 不應該增加調用次數
  });

  it('should only trigger handlers for subscribed event types', () => {
    const accountCreatedHandler = jest.fn();
    const moneyDepositedHandler = jest.fn();

    // 只訂閱 AccountCreated 事件
    eventBus.subscribe('AccountCreated', accountCreatedHandler);

    // 建立不同類型的事件
    const accountCreatedEvent = new AccountCreatedEvent(
      accountId,
      'Test Account',
      new Money(100),
      1,
    );
    const moneyDepositedEvent = new MoneyDepositedEvent(
      accountId,
      new Money(50),
      2,
    );

    // 發布兩種事件
    eventBus.publish([accountCreatedEvent, moneyDepositedEvent]);

    // 只有 AccountCreated 處理器應被調用
    expect(accountCreatedHandler).toHaveBeenCalledTimes(1);
    expect(moneyDepositedHandler).not.toHaveBeenCalled();
  });
});
