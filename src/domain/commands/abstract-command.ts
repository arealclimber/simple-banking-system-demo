import { CommandType } from '../enums/command-type.enum';
import { Command } from '../interfaces/command.interface';
import { AccountId } from '../value-objects/account-id';

export abstract class AbstractCommand implements Command {
  readonly timestamp: Date;

  constructor(
    readonly type: CommandType,
    readonly aggregateId: AccountId,
  ) {
    this.timestamp = new Date();
  }
}
