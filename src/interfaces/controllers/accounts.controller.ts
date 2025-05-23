import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  ParseUUIDPipe,
  Query,
  Inject,
} from '@nestjs/common';
import { BankingService } from '../../application/services/banking.service';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { MoneyDto } from '../dtos/money.dto';
import { TransferDto } from '../dtos/transfer.dto';
import {
  GetTransactionsQueryDto,
  TransactionResponseDto,
} from '../dtos/get-transactions.dto';
import { AccountId } from '../../domain/value-objects/account-id';
import { TransactionLogReadModel } from '../../infrastructure/read-model/transaction-log.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly bankingService: BankingService,
    @Inject('TransactionLogReadModel')
    private readonly transactionLog: TransactionLogReadModel,
  ) {}

  /**
   * 創建帳戶
   * @param createAccountDto 創建帳戶 DTO
   * @returns 創建的帳戶 ID
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '創建新帳戶' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '帳戶創建成功',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '12345678-1234-1234-1234-123456789012',
        },
        message: { type: 'string', example: '帳戶創建成功' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '請求數據無效',
  })
  @ApiBody({ type: CreateAccountDto })
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    const accountId = await this.bankingService.createAccount(
      createAccountDto.name,
      createAccountDto.initialBalance.toDomain(),
    );

    return {
      id: accountId.toString(),
      message: '帳戶創建成功',
    };
  }

  /**
   * 存款
   * @param accountId 帳戶 ID
   * @param moneyDto 金額 DTO
   * @returns 成功消息
   */
  @Post(':id/deposit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '向指定帳戶存款' })
  @ApiParam({
    name: 'id',
    description: '帳戶 ID',
    type: String,
  })
  @ApiBody({ type: MoneyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '存款成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '存款成功' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '請求數據無效或帳戶不存在',
  })
  async deposit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() moneyDto: MoneyDto,
  ) {
    const accountId = new AccountId(id);
    await this.bankingService.deposit(accountId, moneyDto.toDomain());

    return {
      message: '存款成功',
    };
  }

  /**
   * 取款
   * @param accountId 帳戶 ID
   * @param moneyDto 金額 DTO
   * @returns 成功消息
   */
  @Post(':id/withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '從指定帳戶取款' })
  @ApiParam({
    name: 'id',
    description: '帳戶 ID',
    type: String,
  })
  @ApiBody({ type: MoneyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取款成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '取款成功' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '請求數據無效、帳戶不存在或餘額不足',
  })
  async withdraw(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() moneyDto: MoneyDto,
  ) {
    const accountId = new AccountId(id);
    await this.bankingService.withdraw(accountId, moneyDto.toDomain());

    return {
      message: '取款成功',
    };
  }

  /**
   * 轉帳
   * @param sourceAccountId 來源帳戶 ID
   * @param transferDto 轉帳 DTO
   * @returns 成功消息
   */
  @Post(':id/transfer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '從指定帳戶轉帳到另一個帳戶' })
  @ApiParam({
    name: 'id',
    description: '來源帳戶 ID',
    type: String,
  })
  @ApiBody({ type: TransferDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '轉帳成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '轉帳成功' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '請求數據無效、帳戶不存在或餘額不足',
  })
  async transfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() transferDto: TransferDto,
  ) {
    const sourceAccountId = new AccountId(id);
    const destinationAccountId = new AccountId(
      transferDto.destinationAccountId,
    );
    await this.bankingService.transfer(
      sourceAccountId,
      destinationAccountId,
      transferDto.amount.toDomain(),
    );

    return {
      message: '轉帳成功',
    };
  }

  /**
   * 獲取帳戶餘額
   * @param accountId 帳戶 ID
   * @returns 帳戶餘額
   */
  @Get(':id/balance')
  @ApiOperation({ summary: '獲取指定帳戶餘額' })
  @ApiParam({
    name: 'id',
    description: '帳戶 ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功獲取餘額',
    schema: {
      type: 'object',
      properties: {
        balance: { type: 'number', example: 1000 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '帳戶不存在',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '帳戶不存在' },
      },
    },
  })
  async getBalance(@Param('id', ParseUUIDPipe) id: string) {
    const accountId = new AccountId(id);
    const balance = await this.bankingService.getBalance(accountId);

    if (!balance) {
      return {
        message: '帳戶不存在',
      };
    }

    return {
      balance: balance.getValue(),
    };
  }

  /**
   * 獲取帳戶交易記錄
   * @param accountId 帳戶 ID
   * @param query 查詢參數
   * @returns 交易記錄列表
   */
  @Get(':id/transactions')
  @ApiOperation({ summary: '獲取指定帳戶的交易記錄' })
  @ApiParam({
    name: 'id',
    description: '帳戶 ID',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    description: '限制返回的交易記錄數量',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'since',
    description: '查詢此時間戳之後的交易記錄（毫秒時間戳）',
    required: false,
    type: Number,
    example: 1640995200000,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功獲取交易記錄',
    type: [TransactionResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '請求參數無效',
  })
  getTransactions(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetTransactionsQueryDto,
  ): TransactionResponseDto[] {
    const accountId = new AccountId(id);

    const transactions = this.transactionLog.getTransactionLogs(
      accountId,
      query.limit,
      query.since,
    );

    return transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      occurredAt: transaction.occurredAt,
      toAccountId: transaction.toAccountId,
      version: transaction.version,
    }));
  }

  /**
   * 獲取所有帳戶
   * @returns 所有帳戶列表
   */
  @Get()
  @ApiOperation({ summary: '獲取所有帳戶列表' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功獲取帳戶列表',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '12345678-1234-1234-1234-123456789012',
          },
          name: { type: 'string', example: '張三的帳戶' },
          balance: { type: 'number', example: 1000 },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-05-23T02:56:11.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-05-23T02:56:11.000Z',
          },
        },
      },
    },
  })
  async getAllAccounts() {
    const accounts = await this.bankingService.getAllAccounts();

    return accounts.map((account) => ({
      id: account.id.toString(),
      name: account.name,
      balance: account.balance.getValue(),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }));
  }
}
