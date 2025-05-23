#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

interface SerializedEvent {
  type: string;
  aggregateId: string;
  payload: {
    amount?: { amount: number };
    initialBalance?: { amount: number };
    name?: string;
    destinationAccountId?: string;
  };
  version: number;
  occurredAt: number;
}

interface ReplayResult {
  accountId: string;
  finalBalance: number;
  eventCount: number;
}

interface EventsFile {
  events: SerializedEvent[];
}

class EventReplayService {
  /**
   * 重播事件並計算最終餘額
   */
  replayEventsForAccount(
    accountId: string,
    events: SerializedEvent[],
  ): ReplayResult {
    // 過濾出該帳戶的事件
    const accountEvents = events
      .filter((e) => e.aggregateId === accountId)
      .sort((a, b) => a.version - b.version);

    if (accountEvents.length === 0) {
      return {
        accountId,
        finalBalance: 0,
        eventCount: 0,
      };
    }

    // 計算最終餘額
    let balance = 0;
    for (const event of accountEvents) {
      switch (event.type) {
        case 'AccountCreatedEvent':
          balance = event.payload.initialBalance?.amount ?? 0;
          break;
        case 'MoneyDepositedEvent':
          balance += event.payload.amount?.amount ?? 0;
          break;
        case 'MoneyWithdrawnEvent':
        case 'MoneyTransferredEvent':
          balance -= event.payload.amount?.amount ?? 0;
          break;
      }
    }

    return {
      accountId,
      finalBalance: balance,
      eventCount: accountEvents.length,
    };
  }

  /**
   * 從 JSON 文件載入事件
   */
  loadEventsFromFile(filePath: string): SerializedEvent[] {
    if (!existsSync(filePath)) {
      console.error(`❌ 事件文件不存在: ${filePath}`);
      process.exit(1);
    }

    try {
      const content = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content) as EventsFile;

      if (!Array.isArray(data.events)) {
        throw new Error('文件格式錯誤：期待 { events: [...] } 格式');
      }

      return data.events;
    } catch (error) {
      console.error(`❌ 載入事件文件失敗: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * 執行完整的事件重放
   */
  performReplay(filePath: string): void {
    console.log('🎬 開始事件重放...\n');

    const events = this.loadEventsFromFile(filePath);
    console.log(`📄 載入 ${events.length} 個事件`);

    // 找出所有帳戶 ID
    const accountIds = [...new Set(events.map((e) => e.aggregateId))];
    console.log(`👥 發現 ${accountIds.length} 個帳戶\n`);

    // 重放每個帳戶的事件
    const results: ReplayResult[] = [];
    let totalBalance = 0;

    for (const accountId of accountIds) {
      const result = this.replayEventsForAccount(accountId, events);
      results.push(result);
      totalBalance += result.finalBalance;

      console.log(
        `🏦 帳戶 ${accountId.slice(0, 8)}... | 餘額: $${result.finalBalance} | 事件數: ${result.eventCount}`,
      );
    }

    console.log('\n' + '='.repeat(60));
    console.log(`💰 總餘額: $${totalBalance}`);
    console.log(`📊 總事件數: ${events.length}`);
    console.log(`✅ 重放完成！所有帳戶餘額已驗證。`);

    // 驗證餘額守恆（對於轉帳操作）
    this.validateBalanceConservation(events, totalBalance);
  }

  /**
   * 驗證餘額守恆性
   */
  private validateBalanceConservation(
    events: SerializedEvent[],
    totalBalance: number,
  ): void {
    const deposits = events
      .filter((e) => e.type === 'MoneyDepositedEvent')
      .reduce((sum, e) => sum + (e.payload.amount?.amount ?? 0), 0);

    const withdrawals = events
      .filter((e) => e.type === 'MoneyWithdrawnEvent')
      .reduce((sum, e) => sum + (e.payload.amount?.amount ?? 0), 0);

    const initialBalances = events
      .filter((e) => e.type === 'AccountCreatedEvent')
      .reduce((sum, e) => sum + (e.payload.initialBalance?.amount ?? 0), 0);

    // 轉帳事件不影響總餘額，因為是系統內部資金移動
    const expectedTotal = initialBalances + deposits - withdrawals;

    if (Math.abs(totalBalance - expectedTotal) < 0.01) {
      console.log('✅ 餘額守恆驗證通過');
    } else {
      console.error(
        `❌ 餘額守恆驗證失敗！期待: $${expectedTotal}, 實際: $${totalBalance}`,
      );
      process.exit(1);
    }
  }
}

// 命令行界面
if (require.main === module) {
  const filePath =
    process.argv[2] || resolve(__dirname, '../test-data/events.json');

  const replayService = new EventReplayService();
  try {
    replayService.performReplay(filePath);
  } catch (error) {
    console.error('❌ 重放失敗:', (error as Error).message);
    process.exit(1);
  }
}

export { EventReplayService };
