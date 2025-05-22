import { Inject, Injectable } from '@nestjs/common';
import { AccountId } from '../../domain/value-objects/account-id';
import { Money } from '../../domain/value-objects/money';
import { CreateAccountCommand } from '../../domain/commands/create-account.command';
import { DepositCommand } from '../../domain/commands/deposit.command';
import { WithdrawCommand } from '../../domain/commands/withdraw.command';
import { TransferCommand } from '../../domain/commands/transfer.command';
import { COMMAND_BUS } from '../../infrastructure/bus/command-bus.interface';
import { CommandBus } from '../../infrastructure/bus/command-bus.interface';
import { READ_MODEL } from '../../infrastructure/read-model/read-model.interface';
import {
  BalanceReadModel,
  AccountDetails,
} from '../../infrastructure/read-model/read-model.interface';
import {
  EventStore,
  EVENT_STORE,
} from '../../infrastructure/event-store/event-store.interface';

/**
 * 銀行服務，作為領域功能的門面
 */
@Injectable()
export class BankingService {
  constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: CommandBus,
    @Inject(READ_MODEL) private readonly readModel: BalanceReadModel,
    @Inject(EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  /**
   * 創建新帳戶
   * @param name 帳戶名稱
   * @param initialBalance 初始餘額
   * @returns 創建的帳戶ID
   */
  async createAccount(name: string, initialBalance: Money): Promise<AccountId> {
    const accountId = new AccountId();
    const command = new CreateAccountCommand(accountId, name, initialBalance);

    await this.commandBus.execute(command);
    return accountId;
  }

  /**
   * 存款
   * @param accountId 帳戶ID
   * @param amount 存款金額
   */
  async deposit(accountId: AccountId, amount: Money): Promise<void> {
    const command = new DepositCommand(accountId, amount);
    await this.commandBus.execute(command);
  }

  /**
   * 取款
   * @param accountId 帳戶ID
   * @param amount 取款金額
   */
  async withdraw(accountId: AccountId, amount: Money): Promise<void> {
    const command = new WithdrawCommand(accountId, amount);
    await this.commandBus.execute(command);
  }

  /**
   * 轉帳
   * @param sourceAccountId 來源帳戶ID
   * @param destinationAccountId 目標帳戶ID
   * @param amount 轉帳金額
   */
  async transfer(
    sourceAccountId: AccountId,
    destinationAccountId: AccountId,
    amount: Money,
  ): Promise<void> {
    const command = new TransferCommand(
      sourceAccountId,
      destinationAccountId,
      amount,
    );
    await this.commandBus.execute(command);
  }

  /**
   * 獲取帳戶餘額
   * @param accountId 帳戶ID
   * @returns 帳戶餘額
   */
  async getBalance(accountId: AccountId): Promise<Money | undefined> {
    return this.readModel.getBalance(accountId);
  }

  /**
   * 獲取帳戶詳情
   * @param accountId 帳戶ID
   * @returns 帳戶詳情
   */
  async getAccount(accountId: AccountId): Promise<AccountDetails | undefined> {
    return this.readModel.getAccount(accountId);
  }

  /**
   * 獲取所有帳戶
   * @returns 所有帳戶列表
   */
  async getAllAccounts(): Promise<AccountDetails[]> {
    return this.readModel.getAllAccounts();
  }
}
