import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHistoryProjector } from './transaction-history.projector';
import { InMemoryTransactionLogReadModel } from './in-memory-transaction-log.read-model';
import { TransactionLogReadModel } from './transaction-log.interface';
import { EventBus, EVENT_BUS } from '../bus/event-bus.interface';
import { MoneyDepositedEvent } from '../../domain/events/money-deposited.event';
import { MoneyTransferredEvent } from '../../domain/events/money-transferred.event';
import { AccountId } from '../../domain/value-objects/account-id';
import { Money } from '../../domain/value-objects/money';
import { TimestampUtils } from '../../domain/types/timestamp.types';

describe('TransactionHistoryProjector', () => {
  let transactionLog: TransactionLogReadModel;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const mockEventBus: jest.Mocked<EventBus> = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionHistoryProjector,
        InMemoryTransactionLogReadModel,
        {
          provide: EVENT_BUS,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    module.get<TransactionHistoryProjector>(TransactionHistoryProjector);
    transactionLog = module.get<InMemoryTransactionLogReadModel>(
      InMemoryTransactionLogReadModel,
    );
    eventBus = module.get(EVENT_BUS);
  });

  describe('冪等性測試', () => {
    it('should handle repeated MoneyDepositedEvent idempotently', () => {
      // Arrange
      const accountId = AccountId.create();
      const timestamp = TimestampUtils.now();
      const depositEvent = new MoneyDepositedEvent(
        accountId,
        new Money(100),
        timestamp,
        1,
      );

      // 模擬事件處理器被呼叫
      const subscribeCall = eventBus.subscribe.mock.calls.find(
        (call) => call[0] === 'MoneyDepositedEvent',
      );
      expect(subscribeCall).toBeDefined();
      const handler = subscribeCall![1];

      // Act: 重複處理同一事件兩次
      handler(depositEvent);
      const transactionsAfterFirst =
        transactionLog.getTransactionLogs(accountId);

      handler(depositEvent);
      const transactionsAfterSecond =
        transactionLog.getTransactionLogs(accountId);

      // Assert: 日誌長度應該保持不變（冪等性）
      expect(transactionsAfterFirst).toHaveLength(1);
      expect(transactionsAfterSecond).toHaveLength(1);
      expect(transactionsAfterFirst[0].type).toBe('deposit');
      expect(transactionsAfterFirst[0].amount).toBe(100);
    });

    it('should handle transfer events correctly', () => {
      // Arrange
      const fromAccountId = AccountId.create();
      const toAccountId = AccountId.create();
      const timestamp = TimestampUtils.now();
      const transferEvent = new MoneyTransferredEvent(
        fromAccountId,
        new Money(300),
        toAccountId,
        timestamp,
        2,
      );

      // 模擬事件處理器被呼叫
      const subscribeCall = eventBus.subscribe.mock.calls.find(
        (call) => call[0] === 'MoneyTransferredEvent',
      );
      expect(subscribeCall).toBeDefined();
      const handler = subscribeCall![1];

      // Act
      handler(transferEvent);

      // Assert: 檢查轉出方的記錄
      const fromTransactions = transactionLog.getTransactionLogs(fromAccountId);
      expect(fromTransactions).toHaveLength(1);

      const transferLog = fromTransactions[0];
      expect(transferLog.type).toBe('transfer');
      expect(transferLog.amount).toBe(300);
      expect(transferLog.toAccountId).toBe(toAccountId.toString());
      expect(transferLog.occurredAt).toBeDefined();
    });
  });

  describe('查詢功能測試', () => {
    it('should support limit and since parameters', () => {
      // Arrange
      const accountId = AccountId.create();
      const now = TimestampUtils.now();
      const earlier = now - 10000;

      // 添加一些測試數據
      transactionLog.addTransactionLog(accountId, {
        id: 'test-1',
        type: 'deposit',
        amount: 100,
        occurredAt: earlier,
        version: 1,
      });

      transactionLog.addTransactionLog(accountId, {
        id: 'test-2',
        type: 'withdraw',
        amount: 50,
        occurredAt: now,
        version: 2,
      });

      // Act & Assert: 測試 limit
      const limitedTransactions = transactionLog.getTransactionLogs(
        accountId,
        1,
      );
      expect(limitedTransactions).toHaveLength(1);
      expect(limitedTransactions[0].id).toBe('test-2'); // 應該是最新的

      // Act & Assert: 測試 since
      const recentTransactions = transactionLog.getTransactionLogs(
        accountId,
        undefined,
        now - 1,
      );
      expect(recentTransactions).toHaveLength(1);
      expect(recentTransactions[0].id).toBe('test-2');
    });
  });
});
