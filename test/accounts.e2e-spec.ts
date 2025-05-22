import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AccountId } from '../src/domain/value-objects/account-id';
import { COMMAND_BUS } from '../src/infrastructure/bus/command-bus.interface';
import { EVENT_BUS } from '../src/infrastructure/bus/event-bus.interface';
import { EVENT_STORE } from '../src/infrastructure/event-store/event-store.interface';
import { READ_MODEL } from '../src/infrastructure/read-model/read-model.interface';
import { Money } from '../src/domain/value-objects/money';
import { CommandBus } from '../src/infrastructure/bus/command-bus.interface';

// 定義類型以避免 any 引起的 lint 錯誤
interface MockCommandBus extends CommandBus {
  execute: jest.Mock;
  register: jest.Mock;
}

interface AccountResponse {
  id: string;
  name: string;
  balance: number;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageResponse {
  message: string;
}

interface BalanceResponse {
  balance: number;
}

describe('AccountsController (e2e)', () => {
  let app: INestApplication;
  let accountId: string;
  let commandBusMock: MockCommandBus;
  let readModelMock: any;

  beforeAll(async () => {
    // 創建一個固定的帳戶 ID 用於測試
    accountId = new AccountId().toString();

    // 創建 mock 對象
    commandBusMock = {
      execute: jest.fn().mockResolvedValue(undefined),
      register: jest.fn().mockReturnValue(undefined),
    } as MockCommandBus;

    readModelMock = {
      getBalance: jest.fn().mockImplementation((id: AccountId) => {
        // 為測試的帳戶 ID 返回餘額，其他返回 null
        if (id.toString() === accountId) {
          return Promise.resolve(new Money(1000));
        }
        return Promise.resolve(null);
      }),
      getAccount: jest.fn().mockImplementation((id: AccountId) => {
        // 為測試的帳戶 ID 返回帳戶信息，其他返回 null
        if (id.toString() === accountId) {
          return Promise.resolve({
            id,
            name: '測試帳戶',
            balance: new Money(1000),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return Promise.resolve(null);
      }),
      getAllAccounts: jest.fn().mockResolvedValue([
        {
          id: new AccountId(accountId),
          name: '測試帳戶',
          balance: new Money(1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    };

    // 創建測試模塊
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(COMMAND_BUS)
      .useValue(commandBusMock)
      .overrideProvider(EVENT_BUS)
      .useValue({
        publish: jest.fn(),
        subscribe: jest.fn().mockReturnValue(() => {}),
      })
      .overrideProvider(EVENT_STORE)
      .useValue({
        append: jest.fn().mockResolvedValue(undefined),
        load: jest.fn().mockResolvedValue([]),
      })
      .overrideProvider(READ_MODEL)
      .useValue(readModelMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('應成功創建帳戶 (POST /accounts)', () => {
    const createAccountDto = {
      name: '新測試帳戶',
      initialBalance: { amount: 500 },
    };

    // 模擬 commandBus.execute 的返回值
    commandBusMock.execute.mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .post('/accounts')
      .send(createAccountDto)
      .expect(201)
      .expect((res) => {
        // 驗證返回格式
        const response = res.body as AccountResponse;
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('message');
        expect(response.message).toBe('帳戶創建成功');
      });
  });

  it('應成功存款 (POST /accounts/:id/deposit)', () => {
    const depositDto = { amount: 100 };

    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/deposit`)
      .send(depositDto)
      .expect(200)
      .expect((res) => {
        const response = res.body as MessageResponse;
        expect(response).toHaveProperty('message');
        expect(response.message).toBe('存款成功');
      });
  });

  it('應成功取款 (POST /accounts/:id/withdraw)', () => {
    const withdrawDto = { amount: 50 };

    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/withdraw`)
      .send(withdrawDto)
      .expect(200)
      .expect((res) => {
        const response = res.body as MessageResponse;
        expect(response).toHaveProperty('message');
        expect(response.message).toBe('取款成功');
      });
  });

  it('應成功轉帳 (POST /accounts/:id/transfer)', () => {
    const destinationAccountId = new AccountId().toString();
    const transferDto = {
      destinationAccountId,
      amount: { amount: 30 },
    };

    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/transfer`)
      .send(transferDto)
      .expect(200)
      .expect((res) => {
        const response = res.body as MessageResponse;
        expect(response).toHaveProperty('message');
        expect(response.message).toBe('轉帳成功');
      });
  });

  it('應成功獲取餘額 (GET /accounts/:id/balance)', () => {
    return request(app.getHttpServer())
      .get(`/accounts/${accountId}/balance`)
      .expect(200)
      .expect((res) => {
        const response = res.body as BalanceResponse;
        expect(response).toHaveProperty('balance');
        expect(response.balance).toBe(1000);
      });
  });

  it('應成功獲取所有帳戶 (GET /accounts)', () => {
    return request(app.getHttpServer())
      .get('/accounts')
      .expect(200)
      .expect((res) => {
        const responseArray = res.body as AccountResponse[];
        expect(Array.isArray(responseArray)).toBe(true);
        expect(responseArray).toHaveLength(1);
        expect(responseArray[0]).toHaveProperty('id');
        expect(responseArray[0]).toHaveProperty('name');
        expect(responseArray[0]).toHaveProperty('balance');
        expect(responseArray[0].name).toBe('測試帳戶');
      });
  });
});
