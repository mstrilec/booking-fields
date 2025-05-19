import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FieldsService } from '../fields/fields.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly fieldsService: FieldsService,
    private readonly loggerService: LoggerService,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleHourlySync() {
    this.loggerService.log(
      '⏰ Синхронізація полів з Google Places API розпочата',
    );
    await this.fieldsService.syncNearbyFields();
    this.loggerService.log(
      '✅ Синхронізація полів з Google Places API завершена',
    );
  }
}
