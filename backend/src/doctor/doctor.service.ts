import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.doctor.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  async findBySpecialty(specialty: string) {
    return this.prisma.doctor.findMany({
      where: { specialty: { contains: specialty, mode: 'insensitive' } },
      include: { user: { select: { email: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(id: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        appointments: {
          include: { patient: true },
          orderBy: { date: 'asc' },
        },
      },
    });
    if (!doctor) throw new NotFoundException(`Doctor with ID ${id} not found`);
    return doctor;
  }

  async findByUserId(userId: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: { user: { select: { email: true } } },
    });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException(`Doctor with ID ${id} not found`);
    return this.prisma.doctor.update({ where: { id }, data: dto });
  }

  async getDashboardStats(doctorId: number) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const [todayCount, upcomingCount, totalPatients] = await Promise.all([
      this.prisma.appointment.count({
        where: { doctorId, date: { gte: startOfDay, lt: endOfDay } },
      }),
      this.prisma.appointment.count({
        where: { doctorId, date: { gte: now } },
      }),
      this.prisma.appointment.findMany({
        where: { doctorId },
        select: { patientId: true },
        distinct: ['patientId'],
      }),
    ]);

    return {
      todayAppointments: todayCount,
      upcomingAppointments: upcomingCount,
      totalPatients: totalPatients.length,
    };
  }

  async getDoctorAppointments(doctorId: number) {
    return this.prisma.appointment.findMany({
      where: { doctorId },
      include: { patient: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getDoctorPatients(doctorId: number) {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: { include: { medicalRecords: true } },
      },
      distinct: ['patientId'],
    });
    return appointments.map((a) => a.patient);
  }
}
