import { Test, TestingModule } from '@nestjs/testing';
import { MutexLockService } from './mutex-lock.service';

describe('MutexLockService', () => {
  let service: MutexLockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MutexLockService],
    }).compile();

    service = module.get<MutexLockService>(MutexLockService);
  });

  afterEach(() => {
    // 每個測試後釋放所有鎖
    service.releaseAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should acquire and release a lock', async () => {
    const resourceId = 'resource1';
    const release = await service.acquire([resourceId]);

    // 鎖釋放後返回的應該是一個函數
    expect(typeof release).toBe('function');

    // 釋放鎖
    release();
  });

  it('should acquire multiple locks in order', async () => {
    const resourceIds = ['resource1', 'resource2', 'resource3'];
    const release = await service.acquire(resourceIds);

    // 釋放鎖
    release();
  });

  it('should wait for lock to be released before acquiring it again', async () => {
    const resourceId = 'resource1';

    // 第一個任務獲取鎖
    const release1 = await service.acquire([resourceId]);

    // 標記以下變數用於檢查
    let lock2Acquired = false;

    // 第二個任務嘗試獲取鎖（此時應該被阻塞）
    const lock2Promise = service.acquire([resourceId]).then(() => {
      lock2Acquired = true;
      return () => {
        /* 釋放鎖 */
      };
    });

    // 等待一小段時間，確認第二個任務被阻塞
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(lock2Acquired).toBe(false);

    // 釋放第一個鎖，第二個任務應該能夠獲取鎖
    release1();

    // 等待第二個任務完成
    const release2 = await lock2Promise;
    expect(lock2Acquired).toBe(true);

    // 釋放第二個鎖
    release2();
  });

  it('should prevent deadlocks by acquiring locks in sorted order', async () => {
    // 創建兩個交叉的資源組
    const resources1 = ['B', 'A']; // 注意：未排序
    const resources2 = ['A', 'C']; // 注意：未排序

    // 追蹤執行順序
    const executionOrder: string[] = [];

    // 任務1：獲取B和A
    const task1 = async () => {
      const release = await service.acquire(resources1);
      executionOrder.push('Task1 acquired locks');
      await new Promise((resolve) => setTimeout(resolve, 20));
      executionOrder.push('Task1 releasing locks');
      release();
    };

    // 任務2：獲取A和C
    const task2 = async () => {
      const release = await service.acquire(resources2);
      executionOrder.push('Task2 acquired locks');
      await new Promise((resolve) => setTimeout(resolve, 10));
      executionOrder.push('Task2 releasing locks');
      release();
    };

    // 同時執行兩個任務
    await Promise.all([task1(), task2()]);

    // 檢查任務是否按順序完成（沒有死鎖）
    expect(executionOrder.length).toBe(4);
  });

  it('should handle concurrent lock requests correctly', async () => {
    const resourceId = 'resource1';

    // 計數器用於追蹤有多少任務成功獲取鎖
    let counter = 0;
    const increment = async () => {
      const release = await service.acquire([resourceId]);
      // 模擬臨界區操作
      const temp = counter;
      await new Promise((resolve) => setTimeout(resolve, 5));
      counter = temp + 1;
      release();
    };

    // 創建10個並發任務
    const tasks = Array(10)
      .fill(0)
      .map(() => increment());

    // 等待所有任務完成
    await Promise.all(tasks);

    // 如果鎖正常工作，計數器應該精確地增加了10次
    expect(counter).toBe(10);
  });
});
