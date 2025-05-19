import { Module } from '@nestjs/common';
import { FieldsModule } from '../fields/fields.module';
import { LoggerModule } from '../logger/logger.module';
import { SchedulerService } from './scheduler.service';

@Module({
  providers: [SchedulerService],
  exports: [SchedulerService],
  imports: [LoggerModule, FieldsModule],
})
export class SchedulerModule {}
