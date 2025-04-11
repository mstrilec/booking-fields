import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from '../entities/field.entity';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), HttpModule],
  controllers: [FieldsController],
  providers: [FieldsService],
})
export class FieldsModule {}
