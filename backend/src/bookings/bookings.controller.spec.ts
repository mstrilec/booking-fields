import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { User } from '../entities/user.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;

  const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    password: 'hashed',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    phoneNumber: '1234567890',
    registrationDate: new Date(),
    bookings: [],
  };

  const mockService = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ id: 1 }),
    create: jest.fn().mockResolvedValue({ id: 1 }),
    update: jest.fn().mockResolvedValue({ id: 1 }),
    remove: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: mockService }],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should return all bookings', async () => {
    const req = { user: mockUser } as unknown as Request;
    const result = await controller.findAll(req);
    expect(mockService.findAll).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual([]);
  });

  it('should return one booking', async () => {
    const req = { user: mockUser } as unknown as Request;
    const result = await controller.findOne(1, req);
    expect(mockService.findOne).toHaveBeenCalledWith(1, mockUser);
    expect(result).toEqual({ id: 1 });
  });

  it('should create a booking', async () => {
    const dto: CreateBookingDto = {
      fieldId: 2,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    };
    const req = { user: mockUser } as unknown as Request;
    const result = await controller.create(dto, req);
    expect(mockService.create).toHaveBeenCalledWith(dto, mockUser.id);
    expect(result).toEqual({ id: 1 });
  });

  it('should update a booking', async () => {
    const dto: UpdateBookingDto = { status: 'confirmed' };
    const req = { user: mockUser } as unknown as Request;
    const result = await controller.update(1, dto, req);
    expect(mockService.update).toHaveBeenCalledWith(1, dto, mockUser);
    expect(result).toEqual({ id: 1 });
  });

  it('should delete a booking', async () => {
    const req = { user: mockUser } as unknown as Request;
    const result = await controller.remove(1, req);
    expect(mockService.remove).toHaveBeenCalledWith(1, mockUser);
    expect(result).toEqual({ id: 1 });
  });
});
