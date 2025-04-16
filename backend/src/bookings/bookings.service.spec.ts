import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { Booking } from '../entities/booking.entity';
import { Field } from '../entities/field.entity';
import { User } from '../entities/user.entity';
import { BookingsService } from './bookings.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let repo: jest.Mocked<Repository<Booking>>;

  const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    password: 'hashed',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    phoneNumber: '',
    registrationDate: new Date(),
    bookings: [],
  };

  const mockAdmin: User = { ...mockUser, id: 2, role: 'admin' };

  const mockField: Field = {
    id: 1,
    placeId: '',
    phoneNumber: '',
    price: 0,
    additionalInfo: '',
    bookings: [],
  };

  const mockBooking: Booking = {
    id: 1,
    user: mockUser,
    field: mockField,
    startTime: new Date(),
    endTime: new Date(),
    status: 'pending',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repo = module.get(getRepositoryToken(Booking));
  });

  it('should return all bookings for admin', async () => {
    repo.find.mockResolvedValue([mockBooking]);
    const result = await service.findAll(mockAdmin);
    expect(result).toEqual([mockBooking]);
  });

  it('should return user bookings', async () => {
    repo.find.mockResolvedValue([mockBooking]);
    const result = await service.findAll(mockUser);
    expect(result).toEqual([mockBooking]);
  });

  it('should return one booking for owner or admin', async () => {
    repo.findOne.mockResolvedValue(mockBooking);
    const result = await service.findOne(1, mockUser);
    expect(result).toEqual(mockBooking);
  });

  it('should throw ForbiddenException if user is not owner', async () => {
    repo.findOne.mockResolvedValue({
      ...mockBooking,
      user: { ...mockUser, id: 3 },
    });
    await expect(service.findOne(1, mockUser)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw NotFoundException if booking not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999, mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a booking', async () => {
    const dto = {
      fieldId: 1,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    };
    const partial = { ...mockBooking };
    delete (partial as Partial<Booking>).id;
    repo.create.mockReturnValue({ ...partial, id: 0 });
    repo.save.mockResolvedValue(mockBooking);
    const result = await service.create(dto, mockUser.id);
    expect(result).toEqual(mockBooking);
  });

  it('should update a booking if owner', async () => {
    repo.findOne.mockResolvedValue(mockBooking);
    const updateDto: UpdateBookingDto = { status: 'confirmed' };
    repo.save.mockResolvedValue({
      ...mockBooking,
      status: updateDto.status!,
    });
    const result = await service.update(1, updateDto, mockUser);
    expect(result.status).toBe('confirmed');
  });

  it('should remove booking if owner', async () => {
    repo.findOne.mockResolvedValue(mockBooking);
    repo.remove.mockResolvedValue(mockBooking);
    const result = await service.remove(1, mockUser);
    expect(result).toEqual(mockBooking);
  });
});
