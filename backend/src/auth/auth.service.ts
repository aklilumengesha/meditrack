import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../core/services/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, role: dto.role },
    });

    if (dto.role === Role.DOCTOR) {
      await this.prisma.doctor.create({
        data: { firstName: dto.firstName, lastName: dto.lastName, specialty: dto.specialty || 'General', phone: dto.phone, userId: user.id },
      });
    }

    if (dto.role === Role.PATIENT) {
      await this.prisma.patient.create({
        data: { firstName: dto.firstName, lastName: dto.lastName, birthDate: dto.birthDate ? new Date(dto.birthDate) : new Date(), address: dto.address, userId: user.id },
      });
    }

    return this.signToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!user.active) throw new UnauthorizedException('Your account has been suspended. Please contact the administrator.');

    return this.signToken(user.id, user.email, user.role, user.mustChangePassword);
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('No account found with this email');

    // Check if there's already a pending request
    const existing = await this.prisma.passwordResetRequest.findFirst({
      where: { userId: user.id, status: 'PENDING' },
    });
    if (existing) return { message: 'A reset request is already pending. Please contact the administrator.' };

    await this.prisma.passwordResetRequest.create({
      data: { email, userId: user.id },
    });

    return { message: 'Your request has been submitted. The administrator will reset your password shortly.' };
  }

  async changePassword(userId: number, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed, mustChangePassword: false },
    });
  }

  private signToken(userId: number, email: string, role: string, mustChangePassword = false) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(payload),
      role,
      mustChangePassword,
    };
  }
}
