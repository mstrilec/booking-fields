import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { FieldsModule } from './fields/fields.module';
import { CommentsModule } from './comments/comments.module';
import { DelayModule } from './delay/delay.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BookingsModule,
    FieldsModule,
    CommentsModule,
    DelayModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
