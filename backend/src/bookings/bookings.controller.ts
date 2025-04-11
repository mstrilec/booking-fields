import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../decorators/roles.decorator';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../types/enums';
import { BookingsService } from './bookings.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}
  @Get()
  @Roles(Role.User, Role.Admin)
  async findAll(@Req() req: Request) {
    const user = req.user as User;
    return this.bookingsService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin)
  async findOne(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    return this.bookingsService.findOne(+id, user);
  }

  @Post()
  @Roles(Role.User)
  async create(@Body() dto: CreateBookingDto, @Req() req: Request) {
    const user = req.user as User;
    return this.bookingsService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles(Role.User, Role.Admin)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBookingDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.bookingsService.update(+id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  async remove(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    return this.bookingsService.remove(+id, user);
  }
}
