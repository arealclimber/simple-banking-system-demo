import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TimestampInMillisecond } from '../../domain/types/timestamp.types';

export class GetTransactionsQueryDto {
  @ApiPropertyOptional({
    description: '限制返回的交易記錄數量',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: '查詢此時間戳之後的交易記錄（毫秒時間戳）',
    example: 1640995200000,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  since?: TimestampInMillisecond;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: '交易記錄唯一標識符',
    example: 'acc-123-1-deposit',
  })
  id: string;

  @ApiProperty({
    description: '交易類型',
    enum: ['deposit', 'withdraw', 'transfer'],
    example: 'deposit',
  })
  type: 'deposit' | 'withdraw' | 'transfer';

  @ApiProperty({
    description: '交易金額',
    example: 100.5,
  })
  amount: number;

  @ApiProperty({
    description: '交易發生時間（毫秒時間戳）',
    example: 1640995200000,
  })
  occurredAt: TimestampInMillisecond;

  @ApiPropertyOptional({
    description: '轉帳目標帳戶ID（僅轉帳交易）',
    example: 'acc-456',
  })
  toAccountId?: string;

  @ApiProperty({
    description: '事件版本號',
    example: 1,
  })
  version: number;
}
