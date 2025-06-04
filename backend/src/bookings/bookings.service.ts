import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { Booking } from '../entities/booking.entity';
import { Field } from '../entities/field.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepo: Repository<Booking>,
    @InjectRepository(Field)
    private fieldsRepo: Repository<Field>,
  ) {}
  async findAll(user: User) {
    return this.bookingsRepo.find({
      where: { user: { id: user.id } },
      relations: ['field'],
    });
  }

  async findOne(id: number, user: User) {
    const booking = await this.bookingsRepo.findOne({
      where: { id },
      relations: ['user', 'field'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (user.role !== 'admin' && booking.user.id !== user.id)
      throw new ForbiddenException();

    return booking;
  }

  async create(dto: CreateBookingDto, userId: number) {
    const field = await this.fieldsRepo.findOne({
      where: { id: dto.fieldId },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    if (dto.expectedPrice && field.price !== dto.expectedPrice) {
      throw new BadRequestException('PRICE_CHANGED');
    }

    const existingBooking = await this.bookingsRepo
      .createQueryBuilder('booking')
      .where('booking.fieldId = :fieldId', { fieldId: dto.fieldId })
      .andWhere('booking.status != :status', { status: 'cancelled' })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime: dto.startTime, endTime: dto.endTime },
      )
      .getOne();

    if (existingBooking) {
      throw new ConflictException('Time slot already booked');
    }

    const booking = this.bookingsRepo.create({
      ...dto,
      user: { id: userId },
      field: { id: dto.fieldId },
      finalPrice: Number(field.price),
    });

    return await this.bookingsRepo.save(booking);
  }

  async update(id: number, dto: UpdateBookingDto, user: User) {
    const booking = await this.bookingsRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (user.role !== 'admin' && booking.user.id !== user.id)
      throw new ForbiddenException();

    Object.assign(booking, dto);
    return this.bookingsRepo.save(booking);
  }

  async remove(id: number, user: User) {
    const booking = await this.bookingsRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (user.role !== 'admin' && booking.user.id !== user.id)
      throw new ForbiddenException();

    return this.bookingsRepo.remove(booking);
  }
}
