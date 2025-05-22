import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AccountId } from '../src/domain/value-objects/account-id';
import { COMMAND_BUS } from '../src/infrastructure/bus/command-bus.interface';
import { EVENT_BUS } from '../src/infrastructure/bus/event-bus.interface';
import { EVENT_STORE } from '../src/infrastructure/event-store/event-store.interface';
import { READ_MODEL } from '../src/infrastructure/read-model/read-model.interface';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

describe('輸入驗證 (e2e)', () => {
  let app: INestApplication;
  let accountId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(COMMAND_BUS)
      .useValue({
        execute: jest.fn().mockResolvedValue(undefined),
        register: jest.fn().mockReturnValue(undefined),
      })
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
      .useValue({
        getBalance: jest.fn().mockResolvedValue(null),
        getAccount: jest.fn().mockResolvedValue(null),
        getAllAccounts: jest.fn().mockResolvedValue([]),
      })
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

    // 創建一個測試帳戶
    accountId = new AccountId().toString();
  });

  afterAll(async () => {
    await app.close();
  });

  it('應拒絕負數金額的存款請求', () => {
    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/deposit`)
      .send({ amount: -1 })
      .expect(400)
      .expect((res) => {
        const response = res.body as ErrorResponse;
        const message = Array.isArray(response.message)
          ? response.message[0]
          : response.message;
        expect(message).toContain('金額不能小於 0');
      });
  });

  it('應拒絕負數金額的取款請求', () => {
    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/withdraw`)
      .send({ amount: -1 })
      .expect(400)
      .expect((res) => {
        const response = res.body as ErrorResponse;
        const message = Array.isArray(response.message)
          ? response.message[0]
          : response.message;
        expect(message).toContain('金額不能小於 0');
      });
  });

  it('應拒絕負數金額的轉帳請求', () => {
    const destinationAccountId = new AccountId().toString();
    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/transfer`)
      .send({
        destinationAccountId,
        amount: { amount: -1 },
      })
      .expect(400)
      .expect((res) => {
        const response = res.body as ErrorResponse;
        const message = Array.isArray(response.message)
          ? response.message[0]
          : response.message;
        expect(message).toContain('金額不能小於 0');
      });
  });

  it('應拒絕無效 UUID 的轉帳請求', () => {
    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/transfer`)
      .send({
        destinationAccountId: 'invalid-uuid',
        amount: { amount: 100 },
      })
      .expect(400)
      .expect((res) => {
        const response = res.body as ErrorResponse;
        const message = Array.isArray(response.message)
          ? response.message[0]
          : response.message;
        expect(message).toContain('目標帳戶 ID 必須為有效的 UUID');
      });
  });
});
