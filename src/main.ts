import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
