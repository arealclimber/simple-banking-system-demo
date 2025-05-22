import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MoneyDto } from './money.dto';

/**
 * 創建帳戶 DTO
 */
export class CreateAccountDto {
  @IsNotEmpty({ message: '帳戶名稱不能為空' })
  @IsString({ message: '帳戶名稱必須為字符串' })
  readonly name: string;

  @IsNotEmpty({ message: '初始餘額不能為空' })
  @ValidateNested()
  @Type(() => MoneyDto)
  readonly initialBalance: MoneyDto;
}
