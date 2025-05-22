import { Injectable } from '@nestjs/common';
import { AccountId } from '../../domain/value-objects/account-id';
import { Money } from '../../domain/value-objects/money';
import { AccountDetails, BalanceReadModel } from './read-model.interface';

@Injectable()
export class InMemoryBalanceReadModel implements BalanceReadModel {
  private readonly accounts = new Map<string, AccountDetails>();

  async getBalance(accountId: AccountId): Promise<Money | undefined> {
    const account = this.accounts.get(accountId.toString());
    return Promise.resolve(account?.balance);
  }

  async getAccount(accountId: AccountId): Promise<AccountDetails | undefined> {
    return Promise.resolve(this.accounts.get(accountId.toString()));
  }

  async getAllAccounts(): Promise<AccountDetails[]> {
    return Promise.resolve(Array.from(this.accounts.values()));
  }

  /**
   * 更新或創建帳戶
   * @param accountId 帳戶 ID
   * @param name 帳戶名稱
   * @param balance 帳戶餘額
   */
  async upsertAccount(
    accountId: AccountId,
    name: string,
    balance: Money,
  ): Promise<void> {
    const accountIdStr = accountId.toString();
    const existingAccount = this.accounts.get(accountIdStr);

    if (existingAccount) {
      // 更新現有帳戶
      this.accounts.set(accountIdStr, {
        ...existingAccount,
        balance,
        updatedAt: new Date(),
      });
    } else {
      // 創建新帳戶
      this.accounts.set(accountIdStr, {
        id: accountId,
        name,
        balance,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return Promise.resolve();
  }
}
