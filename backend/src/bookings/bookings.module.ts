import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { Field } from '../entities/field.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Field])],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
