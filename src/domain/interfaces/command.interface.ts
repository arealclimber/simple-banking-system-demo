import { CommandType } from '../enums/command-type.enum';
import { AccountId } from '../value-objects/account-id';

/**
 * 所有領域命令的基礎接口
 */
export interface DomainCommand {
  /**
   * 命令類型，用於識別命令
   */
  readonly type: string;
}

export interface Command {
  readonly type: CommandType;
  readonly aggregateId: AccountId;
  readonly timestamp: Date;
}
