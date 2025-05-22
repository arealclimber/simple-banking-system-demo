import { Module } from '@nestjs/common';
import { BusModule } from '../infrastructure/bus/bus.module';
import { EventStoreModule } from '../infrastructure/event-store/event-store.module';
import { ReadModelModule } from '../infrastructure/read-model/read-model.module';
import { AccountCommandHandler } from './command-handlers/account-command-handler';
import { BankingService } from './services/banking.service';

@Module({
  imports: [BusModule, EventStoreModule, ReadModelModule],
  providers: [BankingService, AccountCommandHandler],
  exports: [BankingService],
})
export class ApplicationModule {}
