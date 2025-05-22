import { validate } from 'class-validator';
import { MoneyDto } from './money.dto';
import { plainToInstance } from 'class-transformer';

describe('MoneyDto', () => {
  it('應該接受有效的正數金額', async () => {
    const dto = plainToInstance(MoneyDto, { amount: 100 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('應該接受 0 金額', async () => {
    const dto = plainToInstance(MoneyDto, { amount: 0 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('應該拒絕負數金額', async () => {
    const dto = plainToInstance(MoneyDto, { amount: -1 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    // 檢查錯誤消息
    const messages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat();

    expect(messages).toContain('金額不能小於 0');
  });

  it('應該拒絕非數字金額', async () => {
    const dto = plainToInstance(MoneyDto, { amount: 'abc' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    // 檢查錯誤消息
    const messages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat();

    expect(messages).toContain('金額必須為數字');
  });

  it('應該拒絕空白金額', async () => {
    const dto = plainToInstance(MoneyDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    // 檢查錯誤消息
    const messages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat();

    expect(messages).toContain('金額不能為空');
  });

  describe('toDomain', () => {
    it('應該正確轉換為 Money 領域物件', () => {
      const dto = plainToInstance(MoneyDto, { amount: 100 });
      const money = dto.toDomain();
      expect(money.getValue()).toBe(100);
    });
  });
});
