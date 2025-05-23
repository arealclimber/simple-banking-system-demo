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

## 項目架構

項目採用分層架構設計：

- **domain**: 包含領域模型、值對象、聚合和事件定義
- **application**: 包含應用服務和命令處理器
- **infrastructure**: 包含基礎設施組件，如事件存儲和讀模型
- **interfaces**: 包含控制器、DTO 和驗證器
