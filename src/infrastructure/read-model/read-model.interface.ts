import { Money } from '../../domain/value-objects/money';
import { AccountId } from '../../domain/value-objects/account-id';

// 定義讀取模型的注入令牌
export const READ_MODEL = 'READ_MODEL';

/**
 * 帳戶餘額讀取模型
 */
export interface BalanceReadModel {
  /**
   * 獲取帳戶餘額
   * @param accountId 帳戶 ID
   * @returns 帳戶餘額，如果帳戶不存在則返回 undefined
   */
  getBalance(accountId: AccountId): Promise<Money | undefined>;

  /**
   * 獲取帳戶詳情
   * @param accountId 帳戶 ID
   * @returns 帳戶詳情，如果帳戶不存在則返回 undefined
   */
  getAccount(accountId: AccountId): Promise<AccountDetails | undefined>;

  /**
   * 獲取所有帳戶詳情
   * @returns 所有帳戶詳情列表
   */
  getAllAccounts(): Promise<AccountDetails[]>;
}

/**
 * 帳戶詳情
 */
export interface AccountDetails {
  /**
   * 帳戶 ID
   */
  id: AccountId;

  /**
   * 帳戶名稱
   */
  name: string;

  /**
   * 帳戶餘額
   */
  balance: Money;

  /**
   * 創建時間
   */
  createdAt: Date;

  /**
   * 最後更新時間
   */
  updatedAt: Date;
}
