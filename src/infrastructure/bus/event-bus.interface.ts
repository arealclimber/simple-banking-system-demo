import { DomainEvent } from '../../domain/interfaces/event.interface';

// 定義事件總線的注入令牌
export const EVENT_BUS = 'EVENT_BUS';

export interface EventBus {
  /**
   * 發布一個或多個事件
   * @param events 要發布的事件列表
   */
  publish(events: DomainEvent[]): void;

  /**
   * 訂閱特定事件類型
   * @param eventType 事件類型
   * @param handler 處理函數
   * @returns 取消訂閱的函數
   */
  subscribe(
    eventType: string,
    handler: (event: DomainEvent) => void,
  ): () => void;
}
