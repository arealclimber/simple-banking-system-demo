import { Module } from '@nestjs/common';
import { InMemoryEventStore } from './in-memory-event-store';
import { EVENT_STORE } from './event-store.interface';

@Module({
  providers: [
    {
      provide: EVENT_STORE,
      useClass: InMemoryEventStore,
    },
  ],
  exports: [EVENT_STORE],
})
export class EventStoreModule {}
