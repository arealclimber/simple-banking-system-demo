import { Module } from '@nestjs/common';
import { BalanceProjector } from './balance-projector';
import { InMemoryBalanceReadModel } from './in-memory-balance-read-model';
import { TransactionHistoryProjector } from './transaction-history.projector';
import { InMemoryTransactionLogReadModel } from './in-memory-transaction-log.read-model';
import { BusModule } from '../bus/bus.module';
import { READ_MODEL } from './read-model.interface';

@Module({
  imports: [BusModule],
  providers: [
    BalanceProjector,
    InMemoryBalanceReadModel,
    InMemoryTransactionLogReadModel,
    TransactionHistoryProjector,
    {
      provide: 'TransactionLogReadModel',
      useExisting: InMemoryTransactionLogReadModel,
    },
    {
      provide: READ_MODEL,
      useExisting: InMemoryBalanceReadModel,
    },
  ],
  exports: [
    InMemoryBalanceReadModel,
    InMemoryTransactionLogReadModel,
    'TransactionLogReadModel',
    READ_MODEL,
  ],
})
export class ReadModelModule {}
