import { Injectable } from '@nestjs/common';
import { AccountId } from '../../domain/value-objects/account-id';
import {
  TransactionLog,
  TransactionLogReadModel,
} from './transaction-log.interface';
import { TimestampInMillisecond } from '../../domain/types/timestamp.types';

@Injectable()
export class InMemoryTransactionLogReadModel
  implements TransactionLogReadModel
{
  private logs = new Map<string, TransactionLog[]>();

  getTransactionLogs(
    accountId: AccountId,
    limit?: number,
    since?: TimestampInMillisecond,
  ): TransactionLog[] {
    let logs = this.logs.get(accountId.toString()) || [];

    if (since !== undefined) {
      logs = logs.filter((log) => log.occurredAt > since);
    }

    // 按時間戳降序排序 (最新的在前)
    logs = logs.sort((a, b) => b.occurredAt - a.occurredAt);

    if (limit !== undefined) {
      logs = logs.slice(0, limit);
    }

    return logs;
  }

  addTransactionLog(accountId: AccountId, log: TransactionLog): void {
    const accountKey = accountId.toString();

    if (!this.logs.has(accountKey)) {
      this.logs.set(accountKey, []);
    }

    const existingLogs = this.logs.get(accountKey)!;

    // 檢查是否已存在相同 ID 的日誌 (冪等性)
    if (!existingLogs.some((existingLog) => existingLog.id === log.id)) {
      existingLogs.push(log);
    }
  }

  clear(): void {
    this.logs.clear();
  }
}
