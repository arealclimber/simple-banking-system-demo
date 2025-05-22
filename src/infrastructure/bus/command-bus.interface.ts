import { Command } from '../../domain/interfaces/command.interface';

// 定義命令總線的注入令牌
export const COMMAND_BUS = 'COMMAND_BUS';

export interface CommandBus {
  /**
   * 執行命令
   * @param command 要執行的命令
   */
  execute<T extends Command>(command: T): Promise<void>;

  /**
   * 註冊命令處理器
   * @param commandType 命令類型
   * @param handler 處理函數
   */
  register(
    commandType: string,
    handler: (command: Command) => Promise<void>,
  ): void;
}
