import { Injectable, Inject } from '@nestjs/common';
import { EventBus, EVENT_BUS } from '../bus/event-bus.interface';
import { EventType } from '../../domain/enums/event-type.enum';
import { MoneyDepositedEvent } from '../../domain/events/money-deposited.event';
import { MoneyWithdrawnEvent } from '../../domain/events/money-withdrawn.event';
import { MoneyTransferredEvent } from '../../domain/events/money-transferred.event';
import { InMemoryTransactionLogReadModel } from './in-memory-transaction-log.read-model';

@Injectable()
export class TransactionHistoryProjector {
  constructor(
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
    private readonly transactionLogReadModel: InMemoryTransactionLogReadModel,
  ) {
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.eventBus.subscribe(EventType.MONEY_DEPOSITED, (event) => {
      this.handleMoneyDeposited(event as MoneyDepositedEvent);
    });

    this.eventBus.subscribe(EventType.MONEY_WITHDRAWN, (event) => {
      this.handleMoneyWithdrawn(event as MoneyWithdrawnEvent);
    });

    this.eventBus.subscribe(EventType.MONEY_TRANSFERRED, (event) => {
      this.handleMoneyTransferred(event as MoneyTransferredEvent);
    });
  }

  private handleMoneyDeposited(event: MoneyDepositedEvent): void {
    const log = {
      id: `${event.aggregateId.toString()}-${event.version}-deposit`,
      type: 'deposit' as const,
      amount: event.amount.getValue(),
      occurredAt: event.occurredAt,
      version: event.version,
    };

    this.transactionLogReadModel.addTransactionLog(event.aggregateId, log);
  }

  private handleMoneyWithdrawn(event: MoneyWithdrawnEvent): void {
    const log = {
      id: `${event.aggregateId.toString()}-${event.version}-withdraw`,
      type: 'withdraw' as const,
      amount: event.amount.getValue(),
      occurredAt: event.occurredAt,
      version: event.version,
    };

    this.transactionLogReadModel.addTransactionLog(event.aggregateId, log);
  }

  private handleMoneyTransferred(event: MoneyTransferredEvent): void {
    const log = {
      id: `${event.aggregateId.toString()}-${event.version}-transfer`,
      type: 'transfer' as const,
      amount: event.amount.getValue(),
      toAccountId: event.toAccountId.toString(),
      occurredAt: event.occurredAt,
      version: event.version,
    };

    this.transactionLogReadModel.addTransactionLog(event.aggregateId, log);
  }
}
