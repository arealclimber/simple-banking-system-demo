<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# 銀行系統 API

一個使用 NestJS 和事件源架構實現的簡單銀行系統，支持帳戶管理、交易操作和完整的交易記錄追蹤。

## 🎯 面試展示：交易記錄功能

### ⚡ 5 分鐘快速驗證

**步驟 1: 一鍵功能演示**

```bash
npm install
npm run demo
```

這會自動展示所有交易記錄功能，包括：

- ✅ 創建帳戶並執行各種交易
- ✅ 查詢交易記錄（包含 when、amount、toAccountId）
- ✅ 測試 limit 和 since 查詢參數
- ✅ 驗證冪等性保證

**步驟 2: 測試覆蓋驗證**

```bash
# 交易記錄端對端測試（6個場景）
npm run test:e2e -- --testPathPattern=transaction-log.e2e-spec.ts

# 交易記錄單元測試（3個場景，專注冪等性）
npm run test -- --testPathPattern=transaction-history.projector.spec.ts
```

**步驟 3: API 文檔查看**

```bash
npm run start:dev
# 訪問 http://localhost:3000/api
# 查看 GET /accounts/{id}/transactions 端點
```

### 📊 題目要求完整對照

| 面試要求                         | 實現位置                    | 驗證方法                  |
| -------------------------------- | --------------------------- | ------------------------- |
| **Transaction log per transfer** | TransactionHistoryProjector | 演示腳本展示轉帳記錄      |
| **when (時間戳)**                | LogEntry.occurredAt         | API 響應包含毫秒時間戳    |
| **amount (金額)**                | LogEntry.amount             | API 響應包含精確金額      |
| **to-what-account (目標帳戶)**   | LogEntry.toAccountId        | API 響應包含目標帳戶 UUID |

### 🏗️ 技術亮點

**事件源 + CQRS 架構：**

- 完整審計軌跡，支持事件重播
- 讀寫分離優化查詢性能
- 確定性 ID 保證冪等性

**命名統一優化：**

- 解決了事件類名與事件類型不一致問題
- 使用 TypeScript 枚舉替代魔法字符串
- 提高代碼可維護性和 IDE 支援

**詳細文檔：**

- 📖 [完整驗證指南](docs/transaction-log-verification.md)
- 📖 [面試展示摘要](docs/interview-demo-summary.md)
- 📖 [事件命名規範](docs/event-naming-convention.md)

---

# 簡易銀行系統

使用領域驅動設計和事件源模式實現的簡易銀行系統 API。

## 功能特點

- 基於 NestJS 框架的 RESTful API
- 採用領域驅動設計 (DDD) 和事件源 (Event Sourcing) 架構
- 提供帳戶創建、存款、取款和轉帳等基本銀行操作
- 確保帳戶餘額不能為負數
- 生成帳戶交易日誌
- 支持原子交易（使用基於互斥鎖的並發控制）
- 單元測試和端對端測試

## API 文檔

啟動服務器後，您可以在瀏覽器中訪問 [http://localhost:3000/api](http://localhost:3000/api) 查看 Swagger UI 文檔。

## API 請求示例

以下是使用 `curl` 命令的 API 請求示例：

### 創建帳戶

```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "張三的帳戶",
    "initialBalance": {
      "amount": 1000
    }
  }'
```

### 存款

```bash
curl -X POST http://localhost:3000/accounts/{帳戶ID}/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500
  }'
```

### 取款

```bash
curl -X POST http://localhost:3000/accounts/{帳戶ID}/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200
  }'
```

### 轉帳

```bash
curl -X POST http://localhost:3000/accounts/{來源帳戶ID}/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "destinationAccountId": "{目標帳戶ID}",
    "amount": {
      "amount": 300
    }
  }'
```

### 查詢餘額

```bash
curl -X GET http://localhost:3000/accounts/{帳戶ID}/balance
```

### 查詢所有帳戶

```bash
curl -X GET http://localhost:3000/accounts
```

## 安裝與執行

### 安裝依賴

```bash
npm install
```

### 運行開發服務器

```bash
npm run start:dev
```

### 運行測試

```bash
# 單元測試
npm run test

# e2e 測試
npm run test:e2e

# 測試覆蓋率
npm run test:cov
```

### 構建生產版本

```bash
npm run build
```

## Docker 部署

本專案提供完整的 Docker 支持，適用於開發和生產環境部署。

### 構建 Docker 鏡像

```bash
# 構建鏡像
docker build -t banking-api:latest .

# 查看構建的鏡像
docker images banking-api
```

### 運行 Docker 容器

```bash
# 在後台運行容器，映射到端口 3000
docker run -d -p 3000:3000 --name banking-api banking-api:latest

# 查看運行狀態
docker ps

# 查看應用日誌
docker logs banking-api
```

### 測試 Docker 部署

```bash
# 測試健康檢查端點
curl http://localhost:3000/health

# 預期回應: {"status":"OK"}

# 測試 API 文檔
# 瀏覽器訪問: http://localhost:3000/api
```

### 停止和清理容器

```bash
# 停止容器
docker stop banking-api

# 移除容器
docker rm banking-api

# 移除鏡像（可選）
docker rmi banking-api:latest
```

### Docker 最佳實踐說明

本專案的 Dockerfile 採用以下最佳實踐：

1. **多階段構建**：分離構建環境和運行環境，減少最終鏡像大小
2. **Node.js 20**：使用 Node.js 20 以支援 NestJS 11+ 的引擎要求
3. **生產依賴優化**：使用 `--omit=dev --ignore-scripts` 參數：

   - `--omit=dev`: 只安裝生產依賴，排除開發工具
   - `--ignore-scripts`: 跳過 npm 腳本執行，避免以下問題：
     - **Husky 失敗**：生產容器無 Git 環境，husky install 會失敗
     - **安全考量**：減少執行不必要腳本的潛在風險
     - **構建穩定性**：避免開發工具依賴導致的構建失敗
     - **性能最佳化**：加快容器啟動速度

4. **最小化攻擊面**：生產容器只包含運行應用的必要組件

## Makefile 自動化操作

本專案提供 Makefile 來簡化常見的開發和部署操作，讓開發者能夠快速執行各種任務。

### 查看所有可用命令

```bash
make help
```

這會顯示所有可用的命令及其說明。

### 開發環境

#### 啟動本地開發環境

```bash
# 啟動 watch 模式的開發服務器
make dev

# 等同於: npm run start:dev
```

#### 使用 Docker 啟動開發環境

```bash
# 構建鏡像並啟動開發容器
make dev-docker

# 服務會在 http://localhost:3001 啟動
# API 文檔: http://localhost:3001/api
# 健康檢查: http://localhost:3001/health
```

### 生產環境

#### 一鍵部署生產環境

```bash
# 構建鏡像並啟動生產容器
make prod

# 自動執行以下操作：
# 1. 構建 Docker 鏡像
# 2. 停止並移除現有容器
# 3. 啟動新的生產容器
# 4. 等待應用啟動
```

#### 測試生產環境

```bash
# 部署並自動測試生產環境
make test-docker

# 會執行：
# 1. make prod (構建並啟動)
# 2. 測試健康檢查端點
# 3. 顯示測試結果
```

### 建構和管理

#### Docker 鏡像操作

```bash
# 構建 Docker 鏡像
make build

# 強制重新構建（無快取）
make build-no-cache

# 查看容器和鏡像狀態
make status
```

#### 測試相關命令

```bash
# 運行單元測試
make test

# 運行端對端測試
make test-e2e

# 運行代碼檢查
make lint

# 格式化代碼
make format
```

### 清理和維護

#### 清理容器

```bash
# 停止並移除容器
make clean

# 清理容器和鏡像
make clean-all
```

#### 查看狀態和日誌

```bash
# 查看容器狀態
make status

# 查看容器日誌
make logs

# 安裝依賴
make install
```

### 常用工作流程示例

#### 完整的開發流程

```bash
# 1. 安裝依賴
make install

# 2. 運行測試確保代碼正常
make test

# 3. 檢查代碼風格
make lint

# 4. 啟動開發環境
make dev
```

#### 生產部署和驗證

```bash
# 1. 構建並部署生產環境
make prod

# 2. 測試部署是否成功
curl http://localhost:3001/health

# 3. 查看運行狀態
make status

# 4. 查看日誌（如需要）
make logs

# 5. 清理（完成後）
make clean
```

#### 完整的 CI/CD 模擬

```bash
# 1. 運行所有測試
make test && make test-e2e

# 2. 檢查代碼品質
make lint

# 3. 測試 Docker 生產環境
make test-docker

# 4. 清理環境
make clean-all
```

### 端口配置

- **開發環境**：http://localhost:3001
- **API 文檔**：http://localhost:3001/api
- **健康檢查**：http://localhost:3001/health

> **注意**：Makefile 預設使用端口 3001 以避免與其他服務衝突。如需修改端口，請編輯 Makefile 中的 `PORT` 變數。

## 項目架構

項目採用分層架構設計：

- **domain**: 包含領域模型、值對象、聚合和事件定義
- **application**: 包含應用服務和命令處理器
- **infrastructure**: 包含基礎設施組件，如事件存儲和讀模型
- **interfaces**: 包含控制器、DTO 和驗證器

## 架構設計決策

### 事件源模式 (Event Sourcing)

本專案採用事件源模式作為核心架構策略，具有以下優勢：

#### 1. 完整的審計軌跡

- **不可變事件流**：每個業務操作都以事件形式記錄，形成完整的歷史軌跡
- **時間旅行**：可以重播任意時間點的系統狀態
- **合規要求**：滿足金融業對交易記錄的嚴格要求

#### 2. 高性能讀寫分離 (CQRS)

- **命令端**：專注於業務規則驗證和事件產生
- **查詢端**：針對特定用例優化的讀取模型
- **獨立擴展**：讀寫操作可以獨立優化和擴展

#### 3. 業務邏輯的純粹性

```typescript
// 聚合只關注業務規則，不涉及基礎設施
class AccountAggregate {
  execute(command: DepositCommand): DomainEvent[] {
    // 純業務邏輯驗證
    return [new MoneyDepositedEvent(...)];
  }
}
```

### 併發控制策略

#### 1. 樂觀鎖 (Optimistic Locking)

```typescript
// 基於版本號的併發控制
append(aggregateId: string, expectedVersion: number, events: DomainEvent[]): void {
  const currentVersion = this.getCurrentVersion(aggregateId);
  if (currentVersion !== expectedVersion) {
    throw new ConcurrencyError('版本衝突，請重試');
  }
  // 原子性追加事件
}
```

#### 2. 互斥鎖防死鎖 (Mutex with Deadlock Prevention)

```typescript
// 字典序排序防止死鎖
async transfer(fromId: string, toId: string, amount: Money): Promise<void> {
  const sortedIds = [fromId, toId].sort();
  await this.mutexService.withLocks(sortedIds, async () => {
    // 原子性轉帳操作
  });
}
```

#### 3. 併發安全保證

- **帳戶間轉帳**：使用排序鎖避免 A→B 和 B→A 同時進行造成的死鎖
- **餘額一致性**：透過事件重播確保數據完整性
- **冪等性**：投影器支援重複事件處理

### 領域驅動設計 (DDD)

#### 1. 六角架構 (Hexagonal Architecture)

```
  ┌─────────────────────────┐
  │     Interfaces          │  ← REST API, GraphQL
  │   (Ports & Adapters)    │
  └─────────┬───────────────┘
            │
  ┌─────────▼───────────────┐
  │    Application          │  ← Use Cases, Commands
  │   (Orchestration)       │
  └─────────┬───────────────┘
            │
  ┌─────────▼───────────────┐
  │      Domain             │  ← Business Logic (Pure)
  │   (Core Business)       │
  └─────────┬───────────────┘
            │
  ┌─────────▼───────────────┐
  │   Infrastructure        │  ← Database, Event Bus
  │   (Technical Concerns)  │
  └─────────────────────────┘
```

#### 2. 聚合設計原則

- **一致性邊界**：單一聚合內保證強一致性
- **業務不變量**：餘額不能為負數等規則在聚合內執行
- **小聚合**：單一帳戶為一個聚合，避免跨聚合事務

## 事件重放功能

### 使用方式

```bash
# 重放預設測試數據
npm run replay

# 重放指定事件文件
npm run replay path/to/events.json

# 使用 ts-node 直接執行
npx ts-node scripts/replay-events.ts test-data/events.json
```

### 重放腳本功能

1. **事件載入**：從 JSON 文件讀取序列化事件
2. **餘額計算**：按照事件時間順序重建帳戶狀態
3. **一致性驗證**：檢查總餘額守恆定律
4. **詳細報告**：顯示每個帳戶的最終餘額和事件數量

### 示例輸出

```
🎬 開始事件重放...

📄 載入 5 個事件
👥 發現 2 個帳戶

🏦 帳戶 acc-001... | 餘額: $900 | 事件數: 3
🏦 帳戶 acc-002... | 餘額: $700 | 事件數: 2

============================================================
💰 總餘額: $1500
📊 總事件數: 5
✅ 重放完成！所有帳戶餘額已驗證。
✅ 餘額守恆驗證通過
```

## 測試覆蓋率

[![Coverage Status](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](coverage)

本專案包含完整的測試套件：

- **單元測試**：62 個測試，覆蓋所有核心業務邏輯
- **端對端測試**：12 個測試，覆蓋完整的 API 工作流程
- **併發測試**：100 個並發轉帳操作的壓力測試
- **重播測試**：事件重播功能的完整性驗證

## 未來演進路徑

### 階段一：生產就緒 (Production Ready)

#### 1. PostgreSQL 事件存儲

```sql
-- 事件存儲表設計
CREATE TABLE event_store (
  sequence_number BIGSERIAL PRIMARY KEY,
  aggregate_id UUID NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_version INTEGER NOT NULL,
  event_data JSONB NOT NULL,
  metadata JSONB,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(aggregate_id, event_version)
);

-- 效能索引
CREATE INDEX idx_event_store_aggregate_id ON event_store(aggregate_id);
CREATE INDEX idx_event_store_occurred_at ON event_store(occurred_at);
```

#### 2. 快照機制 (Snapshots)

```typescript
interface AggregateSnapshot {
  aggregateId: string;
  aggregateType: string;
  version: number;
  data: any;
  createdAt: Date;
}

// 每 100 個事件建立一次快照
class SnapshotStore {
  save(snapshot: AggregateSnapshot): Promise<void>;
  load(aggregateId: string): Promise<AggregateSnapshot | null>;
}
```

#### 3. 事件版本控制

```typescript
// 支援事件結構演進
interface EventMigration {
  fromVersion: number;
  toVersion: number;
  migrate(event: any): any;
}
```

### 階段二：企業級擴展 (Enterprise Scale)

#### 1. 訊息佇列整合

```typescript
// Apache Kafka 或 RabbitMQ 整合
interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
  publishBatch(events: DomainEvent[]): Promise<void>;
}

// 支援跨服務事件通知
@EventHandler('MoneyTransferredEvent')
class NotificationService {
  async handle(event: MoneyTransferredEvent): Promise<void> {
    // 發送通知、更新外部系統等
  }
}
```

#### 2. 分散式鎖

```typescript
// Redis 分散式鎖替代 in-memory mutex
class DistributedMutexService {
  async acquireLock(keys: string[], ttl: number): Promise<Lock>;
  async releaseLock(lock: Lock): Promise<void>;
}
```

#### 3. 讀取模型分片

```typescript
// 按照帳戶 ID 進行分片
class ShardedBalanceReadModel {
  private getShardKey(accountId: string): string {
    return accountId.slice(-2); // 最後兩位作為分片鍵
  }
}
```

### 階段三：雲原生架構 (Cloud Native)

#### 1. 微服務拆分

- **帳戶服務**：帳戶創建和基本操作
- **交易服務**：轉帳和交易處理
- **查詢服務**：餘額和歷史記錄查詢
- **通知服務**：交易通知和報告

#### 2. 容器化和編排

```yaml
# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: banking-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: banking-api
  template:
    spec:
      containers:
        - name: banking-api
          image: banking-api:latest
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-secret
                  key: url
```

#### 3. 可觀測性

- **分散式追蹤**：Jaeger 或 Zipkin
- **指標監控**：Prometheus + Grafana
- **日誌聚合**：ELK Stack
- **健康檢查**：Kubernetes Probes

### 實施建議

1. **漸進式遷移**：先將 InMemoryEventStore 替換為 PostgreSQL
2. **向後相容**：保持 API 接口不變，內部實作逐步替換
3. **測試驅動**：每個階段都要有對應的測試覆蓋
4. **監控先行**：在重構前建立完善的監控體系
