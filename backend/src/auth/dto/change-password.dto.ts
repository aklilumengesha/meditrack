import { IsString, MinLength } from '@nestjs/class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  newPassword: string;
}
