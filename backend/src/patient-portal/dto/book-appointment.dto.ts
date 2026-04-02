import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class BookAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
