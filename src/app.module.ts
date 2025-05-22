import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { InterfacesModule } from './interfaces/interfaces.module';

@Module({
  imports: [HealthModule, InterfacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
