import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: '系統健康檢查' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '系統運行正常',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        timestamp: {
          type: 'number',
          description: '當前時間戳（毫秒）',
          example: 1640995200000,
        },
      },
    },
  })
  check() {
    return this.healthService.check();
  }
}
