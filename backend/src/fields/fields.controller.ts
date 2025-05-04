import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UpdateFieldDto } from '../dto/update-field.dto';
import { Field } from '../entities/field.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../types/enums';
import { FieldDetails, GooglePlacesResult } from '../types/interfaces';
import { FieldsService } from './fields.service';

@Controller('fields')
export class FieldsController {
  constructor(private fieldService: FieldsService) {}

  @Get()
  getNearbyFields(): Promise<GooglePlacesResult[]> {
    return this.fieldService.getNearbyFields();
  }

  @Get(':placeId')
  getFieldByPlaceId(@Param('placeId') placeId: string): Promise<FieldDetails> {
    return this.fieldService.getFieldByPlaceId(placeId);
  }

  @Post('create')
  createField(@Body('placeId') placeId: string): Promise<Field> {
    return this.fieldService.createFieldFromPlaceId(placeId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':placeId')
  updateField(
    @Param('placeId') placeId: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ): Promise<Field> {
    return this.fieldService.updateField(placeId, updateFieldDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('sync')
  syncNearbyFields(): Promise<void> {
    return this.fieldService.syncNearbyFields();
  }
}
