/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { BankingService } from './banking.service';
import { COMMAND_BUS } from '../../infrastructure/bus/command-bus.interface';
import { READ_MODEL } from '../../infrastructure/read-model/read-model.interface';
import { EVENT_STORE } from '../../infrastructure/event-store/event-store.interface';
import { EventStore } from '../../infrastructure/event-store/event-store.interface';
import { InMemoryCommandBus } from '../../infrastructure/bus/in-memory-command-bus';
import { InMemoryBalanceReadModel } from '../../infrastructure/read-model/in-memory-balance-read-model';
import { AccountId } from '../../domain/value-objects/account-id';
import { Money } from '../../domain/value-objects/money';
import { CreateAccountCommand } from '../../domain/commands/create-account.command';
import { DepositCommand } from '../../domain/commands/deposit.command';
import { WithdrawCommand } from '../../domain/commands/withdraw.command';
import { TransferCommand } from '../../domain/commands/transfer.command';

function getCommandArgument<T>(mock: jest.Mock): T {
  return (mock.mock.calls as unknown[][])[0][0] as T;
}

describe('BankingService', () => {
  let bankingService: BankingService;
  let commandBus: InMemoryCommandBus;
  let readModel: InMemoryBalanceReadModel;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: jest.Mocked<EventStore>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BankingService,
        {
          provide: COMMAND_BUS,
          useClass: InMemoryCommandBus,
        },
        {
          provide: READ_MODEL,
          useClass: InMemoryBalanceReadModel,
        },
        {
          provide: EVENT_STORE,
          useValue: {
            load: jest.fn().mockResolvedValue([]),
            append: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    bankingService = moduleRef.get<BankingService>(BankingService);
    commandBus = moduleRef.get<InMemoryCommandBus>(COMMAND_BUS);
    readModel = moduleRef.get<InMemoryBalanceReadModel>(READ_MODEL);
    eventStore = moduleRef.get<jest.Mocked<EventStore>>(EVENT_STORE);

    // 創建命令執行的 spy
    jest.spyOn(commandBus, 'execute').mockImplementation(async () => {});
  });

  describe('createAccount', () => {
    it('should create a new account with the given name and initial balance', async () => {
      // 準備測試數據
      const name = 'Test Account';
      const initialBalance = new Money(100);

      // 執行測試
      const accountId = await bankingService.createAccount(
        name,
        initialBalance,
      );

      // 驗證結果
      expect(accountId).toBeDefined();
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateAccountCommand),
      );

      // 驗證命令參數
      const command = getCommandArgument<CreateAccountCommand>(
        commandBus.execute as jest.Mock,
      );
      expect(command.aggregateId).toBe(accountId);
      expect(command.name).toBe(name);
      expect(command.initialBalance).toBe(initialBalance);
    });
  });

  describe('deposit', () => {
    it('should deposit money to the account', async () => {
      // 準備測試數據
      const accountId = new AccountId();
      const amount = new Money(50);

      // 執行測試
      await bankingService.deposit(accountId, amount);

      // 驗證結果
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DepositCommand),
      );

      // 驗證命令參數
      const command = getCommandArgument<DepositCommand>(
        commandBus.execute as jest.Mock,
      );
      expect(command.aggregateId).toBe(accountId);
      expect(command.amount).toBe(amount);
    });
  });

  describe('withdraw', () => {
    it('should withdraw money from the account', async () => {
      // 準備測試數據
      const accountId = new AccountId();
      const amount = new Money(30);

      // 執行測試
      await bankingService.withdraw(accountId, amount);

      // 驗證結果
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(WithdrawCommand),
      );

      // 驗證命令參數
      const command = getCommandArgument<WithdrawCommand>(
        commandBus.execute as jest.Mock,
      );
      expect(command.aggregateId).toBe(accountId);
      expect(command.amount).toBe(amount);
    });
  });

  describe('transfer', () => {
    it('should transfer money between accounts', async () => {
      // 準備測試數據
      const sourceAccountId = new AccountId();
      const destinationAccountId = new AccountId();
      const amount = new Money(25);

      // 執行測試
      await bankingService.transfer(
        sourceAccountId,
        destinationAccountId,
        amount,
      );

      // 驗證結果
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(TransferCommand),
      );

      // 驗證命令參數
      const command = getCommandArgument<TransferCommand>(
        commandBus.execute as jest.Mock,
      );
      expect(command.aggregateId).toBe(sourceAccountId);
      expect(command.destinationAccountId).toBe(destinationAccountId);
      expect(command.amount).toBe(amount);
    });
  });

  describe('getBalance', () => {
    it('should return the balance of the account', async () => {
      // 準備測試數據
      const accountId = new AccountId();
      const expectedBalance = new Money(150);
      jest.spyOn(readModel, 'getBalance').mockResolvedValue(expectedBalance);

      // 執行測試
      const balance = await bankingService.getBalance(accountId);

      // 驗證結果
      expect(balance).toBe(expectedBalance);
      expect(readModel.getBalance).toHaveBeenCalledWith(accountId);
    });
  });

  describe('getAccount', () => {
    it('should return the account details', async () => {
      // 準備測試數據
      const accountId = new AccountId();
      const expectedAccount = {
        id: accountId,
        name: 'Test Account',
        balance: new Money(200),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(readModel, 'getAccount').mockResolvedValue(expectedAccount);

      // 執行測試
      const account = await bankingService.getAccount(accountId);

      // 驗證結果
      expect(account).toBe(expectedAccount);
      expect(readModel.getAccount).toHaveBeenCalledWith(accountId);
    });
  });

  describe('getAllAccounts', () => {
    it('should return all accounts', async () => {
      // 準備測試數據
      const expectedAccounts = [
        {
          id: new AccountId(),
          name: 'Account 1',
          balance: new Money(100),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: new AccountId(),
          name: 'Account 2',
          balance: new Money(200),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(readModel, 'getAllAccounts')
        .mockResolvedValue(expectedAccounts);

      // 執行測試
      const accounts = await bankingService.getAllAccounts();

      // 驗證結果
      expect(accounts).toBe(expectedAccounts);
      expect(readModel.getAllAccounts).toHaveBeenCalled();
    });
  });
});
