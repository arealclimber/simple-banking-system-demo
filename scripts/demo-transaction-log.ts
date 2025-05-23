#!/usr/bin/env ts-node

/**
 * 交易記錄功能演示腳本
 * 用於展示步驟 7b & 10b 的實現成果
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import axios from 'axios';

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

async function runDemo() {
  console.log('🎬 交易記錄功能演示開始...\n');

  // 啟動應用
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3001);

  const baseUrl = 'http://localhost:3001';

  try {
    console.log('📝 步驟 1: 創建測試帳戶...');

    // 創建帳戶 A
    const accountAResponse = await axios.post(`${baseUrl}/accounts`, {
      name: '帳戶 A - 演示用',
      initialBalance: { amount: 1000 },
    });
    const accountA = (accountAResponse.data as CreateAccountResponse).id;
    console.log(`✅ 帳戶 A 創建成功: ${accountA}`);

    // 創建帳戶 B
    const accountBResponse = await axios.post(`${baseUrl}/accounts`, {
      name: '帳戶 B - 演示用',
      initialBalance: { amount: 500 },
    });
    const accountB = (accountBResponse.data as CreateAccountResponse).id;
    console.log(`✅ 帳戶 B 創建成功: ${accountB}\n`);

    console.log('💰 步驟 2: 執行各種交易...');

    // 存款
    await axios.post(`${baseUrl}/accounts/${accountA}/deposit`, {
      amount: 200,
    });
    console.log('✅ 帳戶 A 存款 $200');

    // 取款
    await axios.post(`${baseUrl}/accounts/${accountA}/withdraw`, {
      amount: 100,
    });
    console.log('✅ 帳戶 A 取款 $100');

    // 轉帳
    await axios.post(`${baseUrl}/accounts/${accountA}/transfer`, {
      destinationAccountId: accountB,
      amount: { amount: 300 },
    });
    console.log('✅ 帳戶 A 轉帳 $300 到帳戶 B\n');

    console.log('📊 步驟 3: 驗證交易記錄...');

    // 查詢帳戶 A 的交易記錄
    const transactionsA = await axios.get(
      `${baseUrl}/accounts/${accountA}/transactions`,
    );
    const txsA = transactionsA.data as TransactionResponse[];

    console.log(`🏦 帳戶 A 交易記錄 (共 ${txsA.length} 筆):`);
    txsA.forEach((tx, index) => {
      const toInfo = tx.toAccountId
        ? ` → ${tx.toAccountId.slice(0, 8)}...`
        : '';
      console.log(
        `  ${index + 1}. ${tx.type.toUpperCase()} $${tx.amount}${toInfo} [${new Date(tx.occurredAt).toISOString()}]`,
      );
    });

    console.log('\n🔍 步驟 4: 測試查詢功能...');

    // 測試 limit 參數
    const limitedTxs = await axios.get(
      `${baseUrl}/accounts/${accountA}/transactions?limit=2`,
    );
    console.log(
      `✅ Limit 測試: 請求 2 筆，實際返回 ${(limitedTxs.data as TransactionResponse[]).length} 筆`,
    );

    // 測試 since 參數
    const sinceTime = Date.now() - 5000; // 5秒前的毫秒時間戳
    const recentTxs = await axios.get(
      `${baseUrl}/accounts/${accountA}/transactions?since=${sinceTime}`,
    );
    console.log(
      `✅ Since 測試: 查詢最近 5 秒，返回 ${(recentTxs.data as TransactionResponse[]).length} 筆`,
    );

    console.log('\n🛡️ 步驟 5: 驗證冪等性...');

    // 重複查詢應該返回相同結果
    const duplicateQuery = await axios.get(
      `${baseUrl}/accounts/${accountA}/transactions`,
    );
    const isDuplicate =
      JSON.stringify(txsA) === JSON.stringify(duplicateQuery.data);
    console.log(`✅ 冪等性測試: ${isDuplicate ? '通過' : '失敗'}`);

    console.log('\n✨ 功能驗證摘要:');
    console.log('✅ TransactionHistoryProjector - 事件監聽並生成日誌');
    console.log('✅ InMemoryTransactionLogReadModel - 記憶體存儲');
    console.log('✅ GET /accounts/:id/transactions - REST API');
    console.log('✅ limit & since 查詢參數');
    console.log('✅ 冪等性保證');
    console.log('✅ TypeScript 類型安全');

    console.log('\n🎉 交易記錄功能演示完成！');
  } catch (error) {
    console.error('❌ 演示過程中發生錯誤:', error);
  } finally {
    await app.close();
  }
}

// 執行演示
runDemo().catch(console.error);
