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
