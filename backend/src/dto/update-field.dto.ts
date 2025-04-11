import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFieldDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
