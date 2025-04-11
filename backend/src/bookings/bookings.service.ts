import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepo: Repository<Booking>,
  ) {}
  async findAll(user: User) {
    if (user.role === 'admin') {
      return this.bookingsRepo.find({ relations: ['user', 'field'] });
    }
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
    const booking = this.bookingsRepo.create({
      ...dto,
      user: { id: userId },
      field: { id: dto.fieldId },
    });

    return this.bookingsRepo.save(booking);
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
