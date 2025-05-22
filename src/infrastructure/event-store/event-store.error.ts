import { DomainError } from '../../domain/errors/domain.error';

export class EventStoreError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class ConcurrencyError extends EventStoreError {
  constructor(
    public readonly aggregateId: string,
    public readonly expectedVersion: number,
    public readonly actualVersion: number,
  ) {
    super(
      `Concurrency error: expected version ${expectedVersion} but found ${actualVersion} for aggregate ${aggregateId}`,
    );
  }
}
