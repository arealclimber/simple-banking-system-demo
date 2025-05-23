import { Command } from '../interfaces/command.interface';
import { CommandType } from '../enums/command-type.enum';
import { AccountId } from '../value-objects/account-id';
import {
  TimestampInMillisecond,
  TimestampUtils,
} from '../types/timestamp.types';

export abstract class AbstractCommand implements Command {
  readonly timestamp: TimestampInMillisecond;

  constructor(
    public readonly type: CommandType,
    public readonly aggregateId: AccountId,
  ) {
    this.timestamp = TimestampUtils.now();
  }
}
