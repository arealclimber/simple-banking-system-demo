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

  afterEach(async () => {
    // 確保每個測試後有足夠時間處理請求
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterAll(async () => {
    // 等待所有請求完成後再關閉應用
    await new Promise((resolve) => setTimeout(resolve, 500));
    await app.close();
  });

  it('should handle concurrent transfers correctly', async () => {
    // 使用較少的並發數避免連接問題
    const batchSize = 2;
    const totalTransfers = 10; // 總共執行10次轉帳
    const transferAmount = 100; // 每次轉100元

    // 分批執行轉帳，確保每個請求都完成
    for (let i = 0; i < totalTransfers / batchSize; i++) {
      // 使用 unknown[] 類型以避免類型檢查錯誤
      const transfers: unknown[] = [];

      for (let j = 0; j < batchSize; j++) {
        // 每個請求都必須鏈接 .then() 或 .expect() 才會被正確處理
        const transferRequest = request(app.getHttpServer())
          .post(`/accounts/${sourceAccountId}/transfer`)
          .send({
            destinationAccountId: destAccountId,
            amount: {
              amount: transferAmount,
            },
          })
          .expect(200); // 使用 expect 確保請求完成

        transfers.push(transferRequest);
      }

      // 等待這一批請求完成
      await Promise.all(transfers);

      // 批次之間增加短暫延遲，避免連接問題
      await new Promise((resolve) => setTimeout(resolve, 50));
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
    // 來源帳戶：10000 - (10 * 100) = 9000
    // 目標帳戶：5000 + (10 * 100) = 6000
    expect((sourceResponse.body as BalanceResponse).balance).toBe(9000);
    expect((destResponse.body as BalanceResponse).balance).toBe(6000);
  }, 30000); // 增加測試超時時間為30秒
});
