import { CommandType } from '../enums/command-type.enum';
import { AccountId } from '../value-objects/account-id';

export interface Command {
  readonly type: CommandType;
  readonly aggregateId: AccountId;
  readonly timestamp: Date;
}
