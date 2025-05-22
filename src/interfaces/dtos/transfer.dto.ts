import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { MoneyDto } from './money.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 轉帳 DTO
 */
export class TransferDto {
  @ApiProperty({
    description: '目標帳戶 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: '目標帳戶 ID 不能為空' })
  @IsUUID(4, { message: '目標帳戶 ID 必須為有效的 UUID' })
  readonly destinationAccountId: string;

  @ApiProperty({
    description: '轉帳金額',
    type: MoneyDto,
  })
  @IsNotEmpty({ message: '轉帳金額不能為空' })
  @ValidateNested()
  @Type(() => MoneyDto)
  readonly amount: MoneyDto;
}
