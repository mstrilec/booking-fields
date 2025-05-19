import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { CommentsModule } from './comments/comments.module';
import { DatabaseModule } from './database/database.module';
import { DelayModule } from './delay/delay.module';
import { FieldsModule } from './fields/fields.module';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BookingsModule,
    FieldsModule,
    CommentsModule,
    DelayModule,
    LoggerModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
