import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 註冊全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 過濾掉未在 DTO 中定義的屬性
      forbidNonWhitelisted: true, // 禁止未在 DTO 中定義的屬性，否則拋出錯誤
      transform: true, // 自動轉換類型
      transformOptions: {
        enableImplicitConversion: true, // 啟用隱式轉換
      },
    }),
  );

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('簡易銀行系統 API')
    .setDescription(
      '使用領域驅動設計和事件源模式實現的簡易銀行系統 API 文檔。' +
        '支持帳戶創建、存款、取款和轉帳等操作，並確保所有交易的原子性。',
    )
    .setVersion('1.0')
    .addTag('accounts', '帳戶管理相關操作')
    .addTag('health', '系統健康檢查')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '輸入 JWT token',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
