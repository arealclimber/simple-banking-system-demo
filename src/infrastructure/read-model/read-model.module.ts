import { Module } from '@nestjs/common';
import { BusModule } from '../bus/bus.module';
import { BalanceProjector } from './balance-projector';
import { InMemoryBalanceReadModel } from './in-memory-balance-read-model';
import { READ_MODEL } from './read-model.interface';

@Module({
  imports: [BusModule],
  providers: [
    InMemoryBalanceReadModel,
    BalanceProjector,
    {
      provide: READ_MODEL,
      useExisting: InMemoryBalanceReadModel,
    },
  ],
  exports: [READ_MODEL, InMemoryBalanceReadModel],
})
export class ReadModelModule {}
