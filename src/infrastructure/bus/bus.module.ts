import { Module } from '@nestjs/common';
import { COMMAND_BUS } from './command-bus.interface';
import { EVENT_BUS } from './event-bus.interface';
import { InMemoryCommandBus } from './in-memory-command-bus';
import { RxjsEventBus } from './rxjs-event-bus';

@Module({
  providers: [
    {
      provide: COMMAND_BUS,
      useClass: InMemoryCommandBus,
    },
    {
      provide: EVENT_BUS,
      useClass: RxjsEventBus,
    },
  ],
  exports: [COMMAND_BUS, EVENT_BUS],
})
export class BusModule {}
