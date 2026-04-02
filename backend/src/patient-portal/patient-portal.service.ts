import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { UpdatePatientProfileDto } from './dto/update-profile.dto';

@Injectable()
export class PatientPortalService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: { user: { select: { email: true } } },
    });
    if (!patient) throw new NotFoundException('Patient profile not found');
    return patient;
  }

  async updateProfile(userId: number, dto: UpdatePatientProfileDto) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');
    return this.prisma.patient.update({
      where: { userId },
      data: {
        firstName: dto.firstName ?? patient.firstName,
        lastName: dto.lastName ?? patient.lastName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : patient.birthDate,
        address: dto.address ?? patient.address,
      },
    });
  }

  async getMyAppointments(userId: number) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');
    return this.prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async bookAppointment(userId: number, dto: BookAppointmentDto) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: dto.doctorId,
        date: new Date(dto.date),
        startTime: new Date(dto.startTime),
      },
    });
    if (conflict) throw new BadRequestException('This time slot is already booked');

    const startTime = new Date(dto.startTime);
    const hour = startTime.getHours();
    if (hour < 8 || hour >= 18) {
      throw new BadRequestException('Appointments must be between 08:00 and 18:00');
    }

    return this.prisma.appointment.create({
      data: {
        date: new Date(dto.date),
        startTime: new Date(dto.startTime),
        reason: dto.reason,
        patient: { connect: { id: patient.id } },
        doctor: { connect: { id: dto.doctorId } },
      },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
    });
  }

  async cancelAppointment(userId: number, appointmentId: number) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');

    const appt = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appt) throw new NotFoundException('Appointment not found');
    if (appt.patientId !== patient.id) throw new BadRequestException('Not your appointment');
    if (new Date(appt.date) < new Date()) throw new BadRequestException('Cannot cancel a past appointment');

    return this.prisma.appointment.delete({ where: { id: appointmentId } });
  }

  async getMyMedicalRecords(userId: number) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');
    return this.prisma.medicalRecord.findMany({
      where: { patientId: patient.id },
      orderBy: { date: 'desc' },
    });
  }

  async getDashboardSummary(userId: number) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');

    const now = new Date();
    const [nextAppointment, totalRecords, totalAppointments] = await Promise.all([
      this.prisma.appointment.findFirst({
        where: { patientId: patient.id, date: { gte: now } },
        include: { doctor: { select: { firstName: true, lastName: true, specialty: true } } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.medicalRecord.count({ where: { patientId: patient.id } }),
      this.prisma.appointment.count({ where: { patientId: patient.id } }),
    ]);

    return { nextAppointment, totalRecords, totalAppointments };
  }
}
