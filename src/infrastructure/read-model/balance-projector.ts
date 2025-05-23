import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AccountCreatedEvent } from '../../domain/events/account-created.event';
import { MoneyDepositedEvent } from '../../domain/events/money-deposited.event';
import { MoneyTransferredEvent } from '../../domain/events/money-transferred.event';
import { MoneyWithdrawnEvent } from '../../domain/events/money-withdrawn.event';
import { EventType } from '../../domain/enums/event-type.enum';
import { EventBus } from '../bus/event-bus.interface';
import { EVENT_BUS } from '../bus/event-bus.interface';
import { InMemoryBalanceReadModel } from './in-memory-balance-read-model';

/**
 * 餘額投影器，負責將事件轉換為讀取模型
 */
@Injectable()
export class BalanceProjector implements OnModuleInit {
  constructor(
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
    private readonly balanceReadModel: InMemoryBalanceReadModel,
  ) {}

  /**
   * 模塊初始化時訂閱事件
   */
  onModuleInit() {
    this.subscribeToEvents();
  }

  /**
   * 訂閱相關事件
   */
  private subscribeToEvents() {
    // 訂閱帳戶創建事件 - 使用類型安全的枚舉
    this.eventBus.subscribe(EventType.ACCOUNT_CREATED, (event) => {
      const accountCreatedEvent = event as AccountCreatedEvent;
      void this.balanceReadModel.upsertAccount(
        accountCreatedEvent.aggregateId,
        accountCreatedEvent.accountName,
        accountCreatedEvent.initialBalance,
      );
    });

    // 訂閱存款事件 - 使用類型安全的枚舉
    this.eventBus.subscribe(EventType.MONEY_DEPOSITED, (event) => {
      const depositEvent = event as MoneyDepositedEvent;
      void this.handleDepositEvent(depositEvent);
    });

    // 訂閱取款事件 - 使用類型安全的枚舉
    this.eventBus.subscribe(EventType.MONEY_WITHDRAWN, (event) => {
      const withdrawEvent = event as MoneyWithdrawnEvent;
      void this.handleWithdrawEvent(withdrawEvent);
    });

    // 訂閱轉帳事件 - 使用類型安全的枚舉
    this.eventBus.subscribe(EventType.MONEY_TRANSFERRED, (event) => {
      const transferEvent = event as MoneyTransferredEvent;
      void this.handleTransferEvent(transferEvent);
    });
  }

  /**
   * 處理存款事件
   */
  private async handleDepositEvent(event: MoneyDepositedEvent): Promise<void> {
    const accountId = event.aggregateId;
    const account = await this.balanceReadModel.getAccount(accountId);

    if (account) {
      const newBalance = account.balance.add(event.amount);
      await this.balanceReadModel.upsertAccount(
        accountId,
        account.name,
        newBalance,
      );
    }
  }

  /**
   * 處理取款事件
   */
  private async handleWithdrawEvent(event: MoneyWithdrawnEvent): Promise<void> {
    const accountId = event.aggregateId;
    const account = await this.balanceReadModel.getAccount(accountId);

    if (account) {
      const newBalance = account.balance.subtract(event.amount);
      await this.balanceReadModel.upsertAccount(
        accountId,
        account.name,
        newBalance,
      );
    }
  }

  /**
   * 處理轉帳事件
   */
  private async handleTransferEvent(
    event: MoneyTransferredEvent,
  ): Promise<void> {
    const sourceAccountId = event.aggregateId;
    const destinationAccountId = event.toAccountId;

    // 處理轉出方
    const sourceAccount =
      await this.balanceReadModel.getAccount(sourceAccountId);
    if (sourceAccount) {
      const newSourceBalance = sourceAccount.balance.subtract(event.amount);
      await this.balanceReadModel.upsertAccount(
        sourceAccountId,
        sourceAccount.name,
        newSourceBalance,
      );
    }

    // 處理轉入方
    const destinationAccount =
      await this.balanceReadModel.getAccount(destinationAccountId);
    if (destinationAccount) {
      const newDestinationBalance = destinationAccount.balance.add(
        event.amount,
      );
      await this.balanceReadModel.upsertAccount(
        destinationAccountId,
        destinationAccount.name,
        newDestinationBalance,
      );
    }
  }
}
