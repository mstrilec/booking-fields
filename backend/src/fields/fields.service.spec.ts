import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Field } from '../entities/field.entity';
import { FieldsService } from './fields.service';

describe('FieldsService', () => {
  let service: FieldsService;
  let repo: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldsService,
        {
          provide: getRepositoryToken(Field),
          useValue: mockRepo,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<FieldsService>(FieldsService);
    repo = module.get(getRepositoryToken(Field));
  });

  it('should return nearby fields', async () => {
    const mockResult = {
      results: [{ place_id: '123', name: 'Field' }],
      status: 'OK',
    };
    mockHttpService.axiosRef.get.mockResolvedValue({ data: mockResult });

    const result = await service.getNearbyFields();
    expect(result).toEqual(mockResult.results);
  });

  it('should return field details', async () => {
    const mockDetails = {
      result: {
        place_id: '123',
        name: 'Field Name',
        formatted_address: 'Address',
        geometry: { location: { lat: 0, lng: 0 } },
        website: 'https://example.com',
        reviews: [],
      },
      status: 'OK',
    };

    mockHttpService.axiosRef.get.mockResolvedValue({ data: mockDetails });
    const result = await service.getFieldByPlaceId('123');

    expect(result.name).toBe('Field Name');
  });

  it('should throw NotFoundException on field details error', async () => {
    mockHttpService.axiosRef.get.mockResolvedValue({
      data: { status: 'ZERO_RESULTS' },
    });
    await expect(service.getFieldByPlaceId('123')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update and save field', async () => {
    repo.findOne.mockResolvedValue({ placeId: '123', phoneNumber: '' });
    repo.save.mockResolvedValue({ placeId: '123', phoneNumber: 'new' });

    const result = await service.updateField('123', { phoneNumber: 'new' });
    expect(result.phoneNumber).toBe('new');
  });

  it('should create and save new field if not found', async () => {
    repo.findOne.mockResolvedValue(null);

    const googleField = {
      placeId: '123',
      phoneNumber: '123456789',
      name: 'Field',
      address: 'Somewhere',
      location: { lat: 0, lng: 0 },
      website: '',
      reviews: [],
    };

    jest.spyOn(service, 'getFieldByPlaceId').mockResolvedValue(googleField);
    repo.create.mockReturnValue(googleField);
    repo.save.mockResolvedValue(googleField);

    const result = await service.updateField('123', { price: 100 });
    expect(result.placeId).toBe('123');
  });
});
