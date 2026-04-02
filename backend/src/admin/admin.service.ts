import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalDoctors, totalPatients, totalAppointments, totalRecords] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.doctor.count(),
        this.prisma.patient.count(),
        this.prisma.appointment.count(),
        this.prisma.medicalRecord.count(),
      ]);
    return { totalUsers, totalDoctors, totalPatients, totalAppointments, totalRecords };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true, email: true, role: true, createdAt: true,
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
        patient: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.prisma.user.delete({ where: { id } });
  }

  async getAllDoctors() {
    return this.prisma.doctor.findMany({
      include: { user: { select: { email: true, createdAt: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  async getAllPatients() {
    return this.prisma.patient.findMany({
      include: { user: { select: { email: true, createdAt: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  async getAllAppointments() {
    return this.prisma.appointment.findMany({
      include: {
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async deleteAppointment(id: number) {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException(`Appointment ${id} not found`);
    return this.prisma.appointment.delete({ where: { id } });
  }
}
