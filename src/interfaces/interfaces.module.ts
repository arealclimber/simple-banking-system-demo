import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { ReadModelModule } from '../infrastructure/read-model/read-model.module';
import { AccountsController } from './controllers/accounts.controller';

@Module({
  imports: [ApplicationModule, ReadModelModule],
  controllers: [AccountsController],
})
export class InterfacesModule {}
