import { Money } from './money';

describe('Money', () => {
  it('should create a valid money instance', () => {
    const money = new Money(100);
    expect(money.getValue()).toBe(100);
  });

  it('should throw error for negative amount', () => {
    expect(() => new Money(-100)).toThrow('Money amount cannot be negative');
  });

  it('should create zero money', () => {
    const zero = Money.zero();
    expect(zero.getValue()).toBe(0);
  });

  it('should add money correctly', () => {
    const money1 = new Money(100);
    const money2 = new Money(50);
    const result = money1.add(money2);
    expect(result.getValue()).toBe(150);
  });

  it('should subtract money correctly', () => {
    const money1 = new Money(100);
    const money2 = new Money(50);
    const result = money1.subtract(money2);
    expect(result.getValue()).toBe(50);
  });

  it('should throw error when subtracting more than available', () => {
    const money1 = new Money(50);
    const money2 = new Money(100);
    expect(() => money1.subtract(money2)).toThrow('Insufficient funds');
  });

  it('should compare money correctly', () => {
    const money1 = new Money(100);
    const money2 = new Money(50);
    const money3 = new Money(100);

    expect(money1.isGreaterThanOrEqual(money2)).toBe(true);
    expect(money2.isGreaterThanOrEqual(money1)).toBe(false);
    expect(money1.isGreaterThanOrEqual(money3)).toBe(true);

    expect(money1.equals(money3)).toBe(true);
    expect(money1.equals(money2)).toBe(false);
  });
});
