import { AccountId } from '../../domain/value-objects/account-id';
import { TimestampInMillisecond } from '../../domain/types/timestamp.types';

export interface TransactionLog {
  id: string; // Deterministic ID for idempotency
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  occurredAt: TimestampInMillisecond; // 毫秒時間戳
  toAccountId?: string; // For transfer events
  version: number;
}

export interface TransactionLogReadModel {
  addTransactionLog(accountId: AccountId, log: TransactionLog): void;
  getTransactionLogs(
    accountId: AccountId,
    limit?: number,
    since?: TimestampInMillisecond,
  ): TransactionLog[];
  clear(): void;
}
