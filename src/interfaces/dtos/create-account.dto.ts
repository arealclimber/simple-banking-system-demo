import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MoneyDto } from './money.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 創建帳戶 DTO
 */
export class CreateAccountDto {
  @ApiProperty({
    description: '帳戶名稱',
    example: '張三的帳戶',
  })
  @IsNotEmpty({ message: '帳戶名稱不能為空' })
  @IsString({ message: '帳戶名稱必須為字串' })
  readonly name: string;

  @ApiProperty({
    description: '初始餘額',
    type: MoneyDto,
  })
  @IsNotEmpty({ message: '初始餘額不能為空' })
  @ValidateNested()
  @Type(() => MoneyDto)
  readonly initialBalance: MoneyDto;
}
