import { Injectable } from '@nestjs/common';
import { Subject, filter } from 'rxjs';
import { DomainEvent } from '../../domain/interfaces/event.interface';
import { EventBus } from './event-bus.interface';

@Injectable()
export class RxjsEventBus implements EventBus {
  private subject$ = new Subject<DomainEvent>();

  publish(events: DomainEvent[]): void {
    for (const event of events) {
      this.subject$.next(event);
    }
  }

  subscribe(
    eventType: string,
    handler: (event: DomainEvent) => void,
  ): () => void {
    const subscription = this.subject$
      .pipe(filter((event) => String(event.type) === eventType))
      .subscribe(handler);

    return () => subscription.unsubscribe();
  }
}
