import { Module } from '@nestjs/common';
import { MutexLockService } from './services/mutex-lock.service';

@Module({
  providers: [MutexLockService],
  exports: [MutexLockService],
})
export class SharedModule {}
