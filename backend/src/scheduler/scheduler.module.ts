import { Module } from '@nestjs/common';
import { FieldsModule } from '../fields/fields.module';
import { SchedulerService } from './scheduler.service';

@Module({
  providers: [SchedulerService],
  exports: [SchedulerService],
  imports: [FieldsModule],
})
export class SchedulerModule {}
