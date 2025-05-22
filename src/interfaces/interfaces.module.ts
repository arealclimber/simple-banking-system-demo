import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AccountsController } from './controllers/accounts.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AccountsController],
})
export class InterfacesModule {}
