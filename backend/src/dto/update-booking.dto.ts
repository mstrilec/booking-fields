import { IsDateString, IsIn, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'cancelled';
}
