import { AccountId } from '../../domain/value-objects/account-id';
import { Money } from '../../domain/value-objects/money';
import { CommandType } from '../../domain/enums/command-type.enum';
import { CreateAccountCommand } from '../../domain/commands/create-account.command';
import { DepositCommand } from '../../domain/commands/deposit.command';
import { InMemoryCommandBus } from './in-memory-command-bus';

describe('InMemoryCommandBus', () => {
  let commandBus: InMemoryCommandBus;

  beforeEach(() => {
    commandBus = new InMemoryCommandBus();
  });

  it('should register and execute command handlers', async () => {
    // 創建模擬處理器
    const createAccountHandler = jest.fn().mockResolvedValue(undefined);
    const depositHandler = jest.fn().mockResolvedValue(undefined);

    // 註冊處理器
    commandBus.register(CommandType.CREATE_ACCOUNT, createAccountHandler);
    commandBus.register(CommandType.DEPOSIT, depositHandler);

    // 創建命令
    const accountId = new AccountId();
    const createAccountCommand = new CreateAccountCommand(
      accountId,
      'Test Account',
      new Money(100),
    );
    const depositCommand = new DepositCommand(accountId, new Money(50));

    // 執行命令
    await commandBus.execute(createAccountCommand);
    await commandBus.execute(depositCommand);

    // 驗證處理器被調用
    expect(createAccountHandler).toHaveBeenCalledWith(createAccountCommand);
    expect(depositHandler).toHaveBeenCalledWith(depositCommand);
  });

  it('should throw error for unregistered command type', async () => {
    const accountId = new AccountId();
    const command = new CreateAccountCommand(
      accountId,
      'Test Account',
      new Money(100),
    );

    // 嘗試執行未註冊的命令
    await expect(commandBus.execute(command)).rejects.toThrow(
      `No handler registered for command type ${CommandType.CREATE_ACCOUNT}`,
    );
  });

  it('should throw error when registering duplicate handler', () => {
    const handler = jest.fn();

    // 註冊處理器
    commandBus.register(CommandType.CREATE_ACCOUNT, handler);

    // 嘗試註冊相同類型的處理器
    expect(() => {
      commandBus.register(CommandType.CREATE_ACCOUNT, handler);
    }).toThrow(
      `Handler already registered for command type ${CommandType.CREATE_ACCOUNT}`,
    );
  });
});
