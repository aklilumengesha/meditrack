import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from '@nestjs/class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  specialty?: string; // required for doctors

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  birthDate?: string; // required for patients

  @IsString()
  @IsOptional()
  address?: string;
}
