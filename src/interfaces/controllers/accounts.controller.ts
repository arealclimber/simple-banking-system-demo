import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BankingService } from '../../application/services/banking.service';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { MoneyDto } from '../dtos/money.dto';
import { TransferDto } from '../dtos/transfer.dto';
import { AccountId } from '../../domain/value-objects/account-id';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly bankingService: BankingService) {}

  /**
   * 創建帳戶
   * @param createAccountDto 創建帳戶 DTO
   * @returns 創建的帳戶 ID
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
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
   * 獲取所有帳戶
   * @returns 所有帳戶列表
   */
  @Get()
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
