import { Test } from '@nestjs/testing';
import { AccountId } from '../../domain/value-objects/account-id';
import { Money } from '../../domain/value-objects/money';
import { AccountCreatedEvent } from '../../domain/events/account-created.event';
import { MoneyDepositedEvent } from '../../domain/events/money-deposited.event';
import { MoneyWithdrawnEvent } from '../../domain/events/money-withdrawn.event';
import { MoneyTransferredEvent } from '../../domain/events/money-transferred.event';
import { EVENT_BUS } from '../bus/event-bus.interface';
import { RxjsEventBus } from '../bus/rxjs-event-bus';
import { BalanceProjector } from './balance-projector';
import { InMemoryBalanceReadModel } from './in-memory-balance-read-model';

/**
 * 簡單的延遲函數，用於等待異步事件處理完成
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('BalanceProjector', () => {
  let balanceProjector: BalanceProjector;
  let eventBus: RxjsEventBus;
  let balanceReadModel: InMemoryBalanceReadModel;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BalanceProjector,
        InMemoryBalanceReadModel,
        {
          provide: EVENT_BUS,
          useClass: RxjsEventBus,
        },
      ],
    }).compile();

    balanceProjector = moduleRef.get<BalanceProjector>(BalanceProjector);
    eventBus = moduleRef.get<RxjsEventBus>(EVENT_BUS);
    balanceReadModel = moduleRef.get<InMemoryBalanceReadModel>(
      InMemoryBalanceReadModel,
    );

    // 手動調用模塊初始化方法
    balanceProjector.onModuleInit();
  });

  it('should update balance when account is created', async () => {
    // 建立測試數據
    const accountId = new AccountId();
    const initialBalance = new Money(100);
    const accountName = 'Test Account';

    // 創建並發布事件
    const event = new AccountCreatedEvent(
      accountId,
      accountName,
      initialBalance,
      1,
    );
    eventBus.publish([event]);

    // 等待事件處理完成
    await delay(10);

    // 驗證讀取模型已更新
    const account = await balanceReadModel.getAccount(accountId);
    expect(account).toBeDefined();
    expect(account?.name).toBe(accountName);
    expect(account?.balance.getValue()).toBe(100);
  });

  it('should update balance when money is deposited', async () => {
    // 建立測試數據
    const accountId = new AccountId();
    const initialBalance = new Money(100);
    const depositAmount = new Money(50);
    const accountName = 'Test Account';

    // 先創建帳戶
    const createEvent = new AccountCreatedEvent(
      accountId,
      accountName,
      initialBalance,
      1,
    );
    eventBus.publish([createEvent]);
    await delay(10);

    // 然後存款
    const depositEvent = new MoneyDepositedEvent(accountId, depositAmount, 2);
    eventBus.publish([depositEvent]);
    await delay(10);

    // 驗證餘額已更新
    const balance = await balanceReadModel.getBalance(accountId);
    expect(balance?.getValue()).toBe(150);
  });

  it('should update balance when money is withdrawn', async () => {
    // 建立測試數據
    const accountId = new AccountId();
    const initialBalance = new Money(100);
    const withdrawAmount = new Money(30);
    const accountName = 'Test Account';

    // 先創建帳戶
    const createEvent = new AccountCreatedEvent(
      accountId,
      accountName,
      initialBalance,
      1,
    );
    eventBus.publish([createEvent]);
    await delay(10);

    // 然後取款
    const withdrawEvent = new MoneyWithdrawnEvent(accountId, withdrawAmount, 2);
    eventBus.publish([withdrawEvent]);
    await delay(10);

    // 驗證餘額已更新
    const balance = await balanceReadModel.getBalance(accountId);
    expect(balance?.getValue()).toBe(70);
  });

  it('should update both accounts when money is transferred', async () => {
    // 建立測試數據
    const sourceAccountId = new AccountId();
    const destinationAccountId = new AccountId();
    const sourceInitialBalance = new Money(100);
    const destinationInitialBalance = new Money(50);
    const transferAmount = new Money(30);

    // 創建兩個帳戶
    eventBus.publish([
      new AccountCreatedEvent(
        sourceAccountId,
        'Source Account',
        sourceInitialBalance,
        1,
      ),
      new AccountCreatedEvent(
        destinationAccountId,
        'Destination Account',
        destinationInitialBalance,
        1,
      ),
    ]);
    await delay(10);

    // 執行轉帳
    const transferEvent = new MoneyTransferredEvent(
      sourceAccountId,
      destinationAccountId,
      transferAmount,
      2,
    );
    eventBus.publish([transferEvent]);
    await delay(10);

    // 驗證兩個帳戶的餘額都已更新
    const sourceBalance = await balanceReadModel.getBalance(sourceAccountId);
    const destinationBalance =
      await balanceReadModel.getBalance(destinationAccountId);

    expect(sourceBalance?.getValue()).toBe(70);
    expect(destinationBalance?.getValue()).toBe(80);
  });
});
