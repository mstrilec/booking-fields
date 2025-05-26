import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FieldsService } from '../fields/fields.service';
import { LoggerService } from '../utils/logger.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly fieldsService: FieldsService) {}
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleHourlySync() {
    LoggerService.log(
      '⏰ Fields synchronization with Google Places API started',
    );
    await this.fieldsService.syncNearbyFields();
    LoggerService.log(
      '✅ Fields synchronization with Google Places API is completed',
    );
  }
}
