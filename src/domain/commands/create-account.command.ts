import { CommandType } from '../enums/command-type.enum';
import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { AbstractCommand } from './abstract-command';

export class CreateAccountCommand extends AbstractCommand {
  constructor(
    readonly aggregateId: AccountId,
    readonly name: string,
    readonly initialBalance: Money,
  ) {
    super(CommandType.CREATE_ACCOUNT, aggregateId);
  }
}
