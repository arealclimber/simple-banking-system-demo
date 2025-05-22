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
    .setDescription('簡易銀行系統的 API 文檔')
    .setVersion('1.0')
    .addTag('banking')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
