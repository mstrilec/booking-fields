import { Module } from '@nestjs/common';
import { DelayService } from './delay.service';

@Module({
  providers: [DelayService],
  exports: [DelayService],
})
export class DelayModule {}
