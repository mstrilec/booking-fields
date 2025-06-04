import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  fieldId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsNumber()
  expectedPrice?: number;
}
