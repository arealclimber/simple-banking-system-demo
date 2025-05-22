import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../domain/interfaces/event.interface';
import { AccountId } from '../../domain/value-objects/account-id';
import { ConcurrencyError } from './event-store.error';
import { EventStore } from './event-store.interface';

@Injectable()
export class InMemoryEventStore implements EventStore {
  private readonly eventStreams = new Map<string, DomainEvent[]>();

  async append(
    aggregateId: AccountId,
    expectedVersion: number,
    events: DomainEvent[],
  ): Promise<void> {
    const aggregateIdStr = aggregateId.toString();
    const currentEvents = this.eventStreams.get(aggregateIdStr) || [];

    // 如果存在事件，檢查版本號
    if (currentEvents.length > 0) {
      const latestEvent = currentEvents[currentEvents.length - 1];
      if (latestEvent.version !== expectedVersion) {
        throw new ConcurrencyError(
          aggregateIdStr,
          expectedVersion,
          latestEvent.version,
        );
      }
    } else if (expectedVersion !== 0) {
      // 如果不存在事件，但期望版本不是 0
      throw new ConcurrencyError(aggregateIdStr, expectedVersion, 0);
    }

    // 附加事件
    this.eventStreams.set(aggregateIdStr, [...currentEvents, ...events]);

    // 模擬異步操作，解決 linter 警告
    await Promise.resolve();
  }

  async load(aggregateId: AccountId): Promise<DomainEvent[]> {
    const aggregateIdStr = aggregateId.toString();

    // 模擬異步操作，解決 linter 警告
    await Promise.resolve();

    return this.eventStreams.get(aggregateIdStr) || [];
  }
}
