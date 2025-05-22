import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { MoneyDto } from './money.dto';

/**
 * 轉帳 DTO
 */
export class TransferDto {
  @IsNotEmpty({ message: '目標帳戶 ID 不能為空' })
  @IsString({ message: '目標帳戶 ID 必須為字符串' })
  @IsUUID(4, { message: '目標帳戶 ID 必須為有效的 UUID' })
  readonly destinationAccountId: string;

  @IsNotEmpty({ message: '轉帳金額不能為空' })
  @ValidateNested()
  @Type(() => MoneyDto)
  readonly amount: MoneyDto;
}
