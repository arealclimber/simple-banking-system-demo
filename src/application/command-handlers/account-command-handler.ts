import { Injectable, OnModuleInit } from '@nestjs/common';
import { CommandType } from '../../domain/enums/command-type.enum';
import { Command } from '../../domain/interfaces/command.interface';
import { AccountAggregate } from '../../domain/aggregates/account.aggregate';
import { CreateAccountCommand } from '../../domain/commands/create-account.command';
import { DepositCommand } from '../../domain/commands/deposit.command';
import { WithdrawCommand } from '../../domain/commands/withdraw.command';
import { TransferCommand } from '../../domain/commands/transfer.command';
import { CommandBus } from '../../infrastructure/bus/command-bus.interface';
import { COMMAND_BUS } from '../../infrastructure/bus/command-bus.interface';
import { EventBus } from '../../infrastructure/bus/event-bus.interface';
import { EVENT_BUS } from '../../infrastructure/bus/event-bus.interface';
import { EventStore } from '../../infrastructure/event-store/event-store.interface';
import { EVENT_STORE } from '../../infrastructure/event-store/event-store.interface';
import { Inject } from '@nestjs/common';
import { AccountState } from '../../domain/aggregates/account-state';

@Injectable()
export class AccountCommandHandler implements OnModuleInit {
  constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: CommandBus,
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
    @Inject(EVENT_STORE) private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    // 註冊創建帳戶命令處理器
    this.commandBus.register(CommandType.CREATE_ACCOUNT, async (command) =>
      this.handleCreateAccount(command as CreateAccountCommand),
    );

    // 註冊存款命令處理器
    this.commandBus.register(CommandType.DEPOSIT, async (command) =>
      this.handleDeposit(command as DepositCommand),
    );

    // 註冊取款命令處理器
    this.commandBus.register(CommandType.WITHDRAW, async (command) =>
      this.handleWithdraw(command as WithdrawCommand),
    );

    // 註冊轉帳命令處理器
    this.commandBus.register(CommandType.TRANSFER, async (command) =>
      this.handleTransfer(command as TransferCommand),
    );
  }

  /**
   * 處理創建帳戶命令
   */
  private async handleCreateAccount(
    command: CreateAccountCommand,
  ): Promise<void> {
    const state = new AccountState();
    const aggregate = new AccountAggregate(state);
    const events = aggregate.execute(command);

    await this.eventStore.append(command.aggregateId, 0, events);

    this.eventBus.publish(events);
  }

  /**
   * 處理存款命令
   */
  private async handleDeposit(command: DepositCommand): Promise<void> {
    await this.loadAndExecute(command);
  }

  /**
   * 處理取款命令
   */
  private async handleWithdraw(command: WithdrawCommand): Promise<void> {
    await this.loadAndExecute(command);
  }

  /**
   * 處理轉帳命令
   */
  private async handleTransfer(command: TransferCommand): Promise<void> {
    await this.loadAndExecute(command);
  }

  /**
   * 通用方法：載入聚合根，執行命令，並儲存/發布事件
   */
  private async loadAndExecute(command: Command): Promise<void> {
    const accountId = command.aggregateId;
    const eventStream = await this.eventStore.load(accountId);

    // 重建聚合根
    const state = new AccountState();
    const aggregate = new AccountAggregate(state);

    // 應用歷史事件
    for (const event of eventStream) {
      state.mutate(event);
    }

    // 執行命令
    const events = aggregate.execute(command);

    // 儲存並發布事件
    await this.eventStore.append(accountId, state.getVersion(), events);
    this.eventBus.publish(events);
  }
}
