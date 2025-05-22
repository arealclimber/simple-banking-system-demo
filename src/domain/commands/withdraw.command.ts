import { CommandType } from '../enums/command-type.enum';
import { AccountId } from '../value-objects/account-id';
import { Money } from '../value-objects/money';
import { AbstractCommand } from './abstract-command';

export class WithdrawCommand extends AbstractCommand {
  constructor(
    readonly aggregateId: AccountId,
    readonly amount: Money,
  ) {
    super(CommandType.WITHDRAW, aggregateId);
  }
}
