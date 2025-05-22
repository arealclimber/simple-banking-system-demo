import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Money } from '../../domain/value-objects/money';

/**
 * 金額 DTO，用於驗證金額輸入
 */
export class MoneyDto {
  @IsNotEmpty({ message: '金額不能為空' })
  @IsNumber({}, { message: '金額必須為數字' })
  @Min(0, { message: '金額不能小於 0' })
  readonly amount: number;

  /**
   * 轉換為領域模型
   * @returns Money 領域物件
   */
  toDomain(): Money {
    return new Money(this.amount);
  }
}
