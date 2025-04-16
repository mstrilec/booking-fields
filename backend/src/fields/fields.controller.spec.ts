import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFieldDto } from '../dto/update-field.dto';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';

describe('FieldsController', () => {
  let controller: FieldsController;

  const mockService = {
    getNearbyFields: jest.fn().mockResolvedValue([{ place_id: '123' }]),
    getFieldByPlaceId: jest.fn().mockResolvedValue({ placeId: '123' }),
    updateField: jest.fn().mockResolvedValue({ placeId: '123' }),
    syncNearbyFields: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldsController],
      providers: [{ provide: FieldsService, useValue: mockService }],
    }).compile();

    controller = module.get<FieldsController>(FieldsController);
  });

  it('should get nearby fields', async () => {
    const result = await controller.getNearbyFields();
    expect(result).toEqual([{ place_id: '123' }]);
  });

  it('should get field by placeId', async () => {
    const result = await controller.getFieldByPlaceId('123');
    expect(result.placeId).toBe('123');
  });

  it('should update field', async () => {
    const dto: UpdateFieldDto = { phoneNumber: '123456' };
    const result = await controller.updateField('123', dto);
    expect(result.placeId).toBe('123');
    expect(mockService.updateField).toHaveBeenCalledWith('123', dto);
  });

  it('should sync nearby fields', async () => {
    await controller.syncNearbyFields();
    expect(mockService.syncNearbyFields).toHaveBeenCalled();
  });
});
