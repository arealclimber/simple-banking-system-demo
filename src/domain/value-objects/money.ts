export class Money {
  private readonly amount: number;

  constructor(amount: number) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    this.amount = amount;
  }

  static zero(): Money {
    return new Money(0);
  }

  getValue(): number {
    return this.amount;
  }

  add(money: Money): Money {
    return new Money(this.amount + money.amount);
  }

  subtract(money: Money): Money {
    const result = this.amount - money.amount;
    if (result < 0) {
      throw new Error('Insufficient funds');
    }
    return new Money(result);
  }

  isGreaterThanOrEqual(money: Money): boolean {
    return this.amount >= money.amount;
  }

  equals(money: Money): boolean {
    return this.amount === money.amount;
  }
}
