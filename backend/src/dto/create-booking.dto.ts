import { IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  fieldId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
