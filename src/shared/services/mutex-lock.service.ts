import { Injectable } from '@nestjs/common';

/**
 * 互斥鎖服務，用於確保轉帳原子性
 *
 * 特點：
 * 1. 按照字典序獲取鎖，避免死鎖
 * 2. 採用回調方式確保鎖的釋放
 * 3. 支持同時獲取多個資源的鎖
 */
@Injectable()
export class MutexLockService {
  // 使用 Map 存儲鎖狀態，資源 ID 映射到對應的互斥鎖
  private locks = new Map<string, Mutex>();

  /**
   * 獲取指定資源的互斥鎖
   * @param resourceIds 資源 ID 陣列
   * @returns 釋放鎖的回調函數
   */
  async acquire(resourceIds: string[]): Promise<() => void> {
    // 對資源 ID 進行排序，防止死鎖
    const sortedIds = [...resourceIds].sort();

    // 儲存已獲取的鎖，用於最後釋放
    const acquiredMutexes: Mutex[] = [];

    try {
      // 依序獲取每個資源的鎖
      for (const id of sortedIds) {
        const mutex = this.getMutex(id);
        await mutex.acquire();
        acquiredMutexes.push(mutex);
      }

      // 返回釋放所有鎖的回調函數
      return () => {
        // 按照獲取鎖的相反順序釋放
        for (const mutex of acquiredMutexes.reverse()) {
          mutex.release();
        }
      };
    } catch (error) {
      // 如果獲取鎖的過程中出錯，釋放已獲取的鎖
      for (const mutex of acquiredMutexes) {
        mutex.release();
      }
      throw error;
    }
  }

  /**
   * 獲取指定資源的互斥鎖對象，如果不存在則創建
   * @param resourceId 資源 ID
   * @returns 互斥鎖對象
   */
  private getMutex(resourceId: string): Mutex {
    if (!this.locks.has(resourceId)) {
      this.locks.set(resourceId, new Mutex());
    }
    return this.locks.get(resourceId)!;
  }

  /**
   * 釋放所有鎖，用於測試或重置
   */
  releaseAll(): void {
    this.locks.clear();
  }
}

/**
 * 互斥鎖類，管理單個資源的鎖定狀態
 * 實現方式：使用 Promise 實現異步等待
 */
class Mutex {
  private locked = false;
  private waitQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
  }> = [];

  /**
   * 獲取鎖，如果鎖已被佔用則等待
   */
  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    // 如果鎖已被佔用，則等待鎖釋放
    return new Promise<void>((resolve, reject) => {
      this.waitQueue.push({ resolve, reject });
    });
  }

  /**
   * 釋放鎖，並喚醒下一個等待的任務
   */
  release(): void {
    if (!this.locked) {
      return;
    }

    if (this.waitQueue.length > 0) {
      // 喚醒下一個等待的任務
      const { resolve } = this.waitQueue.shift()!;
      resolve();
    } else {
      // 如果沒有等待的任務，則釋放鎖
      this.locked = false;
    }
  }

  /**
   * 檢查鎖是否被佔用
   */
  isLocked(): boolean {
    return this.locked;
  }
}
