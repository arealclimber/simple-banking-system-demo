import { AccountId } from './account-id';

describe('AccountId', () => {
  it('should create a random account id when no id is provided', () => {
    const accountId = new AccountId();
    expect(accountId.toString()).toBeDefined();
    expect(accountId.toString()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('should use the provided id when given', () => {
    const id = '12345678-1234-1234-1234-123456789012';
    const accountId = new AccountId(id);
    expect(accountId.toString()).toBe(id);
  });

  it('should properly compare account ids for equality', () => {
    const id = '12345678-1234-1234-1234-123456789012';
    const accountId1 = new AccountId(id);
    const accountId2 = new AccountId(id);
    const accountId3 = new AccountId();

    expect(accountId1.equals(accountId2)).toBe(true);
    expect(accountId1.equals(accountId3)).toBe(false);
  });

  it('should create a new account id with static create method', () => {
    const accountId = AccountId.create();
    expect(accountId.toString()).toBeDefined();
    expect(accountId.toString()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});
