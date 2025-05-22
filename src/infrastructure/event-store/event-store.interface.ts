import { DomainEvent } from '../../domain/interfaces/event.interface';
import { AccountId } from '../../domain/value-objects/account-id';

// 定義事件存儲的注入令牌
export const EVENT_STORE = 'EVENT_STORE';

export interface EventStore {
  /**
   * 將事件附加到指定聚合根的事件流中
   * @param aggregateId 聚合根 ID
   * @param expectedVersion 期望的版本號，用於樂觀並發控制
   * @param events 要附加的事件列表
   * @throws ConcurrencyError 如果實際版本與期望版本不符
   */
  append(
    aggregateId: AccountId,
    expectedVersion: number,
    events: DomainEvent[],
  ): Promise<void>;

  /**
   * 載入指定聚合根的所有事件
   * @param aggregateId 聚合根 ID
   * @returns 事件列表
   */
  load(aggregateId: AccountId): Promise<DomainEvent[]>;
}
