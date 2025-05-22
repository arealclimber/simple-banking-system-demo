import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

interface AccountResponse {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface BalanceResponse {
  balance: number;
}

describe('Concurrent Transfers (e2e)', () => {
  let app: INestApplication;
  let sourceAccountId: string;
  let destAccountId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // 創建源帳戶（餘額：10000）
    const sourceAccount = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'Source Account',
        initialBalance: {
          amount: 10000,
        },
      })
      .expect(201);

    sourceAccountId = (sourceAccount.body as AccountResponse).id;

    // 創建目標帳戶（餘額：5000）
    const destAccount = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'Destination Account',
        initialBalance: {
          amount: 5000,
        },
      })
      .expect(201);

    destAccountId = (destAccount.body as AccountResponse).id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should handle concurrent transfers correctly', async () => {
    // 分批發送請求，每批5個
    const batchSize = 5;
    const totalTransfers = 20;
    const transferAmount = 50;

    for (let i = 0; i < totalTransfers / batchSize; i++) {
      const transfers = Array(batchSize)
        .fill(0)
        .map(() =>
          request(app.getHttpServer())
            .post(`/accounts/${sourceAccountId}/transfer`)
            .send({
              destinationAccountId: destAccountId,
              amount: {
                amount: transferAmount,
              },
            }),
        );

      // 等待每批請求完成
      await Promise.all(transfers);
    }

    // 檢查源帳戶餘額
    const sourceResponse = await request(app.getHttpServer())
      .get(`/accounts/${sourceAccountId}/balance`)
      .expect(200);

    // 檢查目標帳戶餘額
    const destResponse = await request(app.getHttpServer())
      .get(`/accounts/${destAccountId}/balance`)
      .expect(200);

    // 驗證最終餘額
    // 來源帳戶：10000 - (20 * 50) = 9000
    // 目標帳戶：5000 + (20 * 50) = 6000
    expect((sourceResponse.body as BalanceResponse).balance).toBe(9000);
    expect((destResponse.body as BalanceResponse).balance).toBe(6000);
  }, 30000);
});
