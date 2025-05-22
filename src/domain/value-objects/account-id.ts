import { randomUUID } from 'crypto';

export class AccountId {
  private readonly id: string;

  constructor(id?: string) {
    this.id = id || randomUUID();
  }

  toString(): string {
    return this.id;
  }

  equals(other: AccountId): boolean {
    return this.id === other.id;
  }

  static create(): AccountId {
    return new AccountId(randomUUID());
  }
}
