import { Injectable } from '@nestjs/common';
import {
  TimestampInMillisecond,
  TimestampUtils,
} from '../domain/types/timestamp.types';

@Injectable()
export class HealthService {
  check(): { status: string; timestamp: TimestampInMillisecond } {
    return {
      status: 'OK',
      timestamp: TimestampUtils.now(),
    };
  }
}
