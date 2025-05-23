import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

interface CreateAccountResponse {
  id: string;
  message: string;
}

interface TransactionResponse {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  toAccountId?: string;
  fromAccountId?: string;
  occurredAt: number;
  version: number;
}

describe('Transaction Log API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  afterEach(async () => {
    await app.close();
  });

  describe('GET /accounts/:id/transactions', () => {
    it('should return transaction history for account', async () => {
      // 創建帳戶
      const createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: '測試帳戶',
          initialBalance: { amount: 1000 },
        })
        .expect(201);

      const accountId = (createAccountResponse.body as CreateAccountResponse)
        .id;

      // 執行存款
      await request(app.getHttpServer())
        .post(`/accounts/${accountId}/deposit`)
        .send({ amount: 200 })
        .expect(200);

      // 執行取款
      await request(app.getHttpServer())
        .post(`/accounts/${accountId}/withdraw`)
        .send({ amount: 100 })
        .expect(200);

      // 查詢交易記錄
      const transactionsResponse = await request(app.getHttpServer())
        .get(`/accounts/${accountId}/transactions`)
        .expect(200);

      // 驗證返回的交易記錄
      const transactions = transactionsResponse.body as TransactionResponse[];
      expect(transactions).toHaveLength(2);

      // 檢查交易記錄結構
      transactions.forEach((transaction: TransactionResponse) => {
        expect(transaction).toHaveProperty('id');
        expect(transaction).toHaveProperty('type');
        expect(transaction).toHaveProperty('amount');
        expect(transaction).toHaveProperty('occurredAt');
        expect(transaction).toHaveProperty('version');
      });

      const depositTx = transactions.find((tx) => tx.type === 'deposit');
      const withdrawTx = transactions.find((tx) => tx.type === 'withdraw');

      expect(depositTx?.amount).toBe(200);
      expect(withdrawTx?.amount).toBe(100);
    });

    it('should support limit parameter', async () => {
      // 創建帳戶
      const createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: '測試帳戶',
          initialBalance: { amount: 1000 },
        })
        .expect(201);

      const accountId = (createAccountResponse.body as CreateAccountResponse)
        .id;

      // 執行多筆交易
      await request(app.getHttpServer())
        .post(`/accounts/${accountId}/deposit`)
        .send({ amount: 100 })
        .expect(200);

      await request(app.getHttpServer())
        .post(`/accounts/${accountId}/deposit`)
        .send({ amount: 200 })
        .expect(200);

      await request(app.getHttpServer())
        .post(`/accounts/${accountId}/withdraw`)
        .send({ amount: 50 })
        .expect(200);

      // 查詢交易記錄，限制數量為 2
      const transactionsResponse = await request(app.getHttpServer())
        .get(`/accounts/${accountId}/transactions?limit=2`)
        .expect(200);

      const transactions = transactionsResponse.body as TransactionResponse[];
      expect(transactions).toHaveLength(2);
    });

    it('should support since parameter', async () => {
      // 創建帳戶
      const createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: '測試帳戶',
          initialBalance: { amount: 1000 },
        })
        .expect(201);

      const accountId = (createAccountResponse.body as CreateAccountResponse)
        .id;

      // 執行第一筆交易
      await request(app.getHttpServer())
        .post(`/accounts/${accountId}/deposit`)
        .send({ amount: 100 })
        .expect(200);

      // 記錄時間點（毫秒時間戳）
      const sinceTime = Date.now();

      // 等待一小段時間確保時間戳不同
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 執行第二筆交易
      await request(app.getHttpServer())
        .post(`/accounts/${accountId}/deposit`)
        .send({ amount: 500 })
        .expect(200);

      // 查詢 since 時間之後的交易記錄
      const transactionsResponse = await request(app.getHttpServer())
        .get(`/accounts/${accountId}/transactions?since=${sinceTime}`)
        .expect(200);

      const transactions = transactionsResponse.body as TransactionResponse[];
      expect(transactions).toHaveLength(1);
      expect(transactions[0].type).toBe('deposit');
      expect(transactions[0].amount).toBe(500);
    });

    it('should show transfer details correctly', async () => {
      // 創建兩個帳戶
      const createAccount1Response = await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: '帳戶1',
          initialBalance: { amount: 1000 },
        })
        .expect(201);

      const createAccount2Response = await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: '帳戶2',
          initialBalance: { amount: 500 },
        })
        .expect(201);

      const account1Id = (createAccount1Response.body as CreateAccountResponse)
        .id;
      const account2Id = (createAccount2Response.body as CreateAccountResponse)
        .id;

      // 執行轉帳
      await request(app.getHttpServer())
        .post(`/accounts/${account1Id}/transfer`)
        .send({
          destinationAccountId: account2Id,
          amount: { amount: 300 },
        })
        .expect(200);

      // 查詢轉出帳戶的交易記錄
      const transactionsResponse = await request(app.getHttpServer())
        .get(`/accounts/${account1Id}/transactions`)
        .expect(200);

      const transactions = transactionsResponse.body as TransactionResponse[];
      const transferTx = transactions.find((tx) => tx.type === 'transfer');

      expect(transferTx).toBeDefined();
      expect(transferTx!.amount).toBe(300);
      expect(transferTx!.toAccountId).toBe(account2Id);
    });

    it('should return 400 for invalid account ID', async () => {
      await request(app.getHttpServer())
        .get('/accounts/invalid-uuid/transactions')
        .expect(400);
    });

    it('should validate query parameters', async () => {
      // 創建帳戶
      const createAccountResponse = await request(app.getHttpServer())
        .post('/accounts')
        .send({
          name: '測試帳戶',
          initialBalance: { amount: 1000 },
        })
        .expect(201);

      const accountId = (createAccountResponse.body as CreateAccountResponse)
        .id;

      // 測試無效的 limit 參數
      await request(app.getHttpServer())
        .get(`/accounts/${accountId}/transactions?limit=-1`)
        .expect(400);

      // 測試無效的 since 參數
      await request(app.getHttpServer())
        .get(`/accounts/${accountId}/transactions?since=invalid-date`)
        .expect(400);
    });
  });
});
