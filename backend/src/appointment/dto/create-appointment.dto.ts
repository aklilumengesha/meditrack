import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "@nestjs/class-validator";

export class CreateAppointmentDto {

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    @IsNumber()
    @IsNotEmpty()
    doctorId: number;

    @IsString()
    @IsOptional()
    reason?: string;

    @IsNotEmpty()
    patientId: number;
}
