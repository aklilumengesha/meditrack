import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { UpdatePatientProfileDto } from './dto/update-profile.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PatientPortalService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationService,
  ) {}

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

    const appt = await this.prisma.appointment.create({
      data: {
        date: new Date(dto.date),
        startTime: new Date(dto.startTime),
        reason: dto.reason,
        patient: { connect: { id: patient.id } },
        doctor: { connect: { id: dto.doctorId } },
      },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true, userId: true } },
      },
    });

    // Notify patient
    await this.notifications.create(
      userId,
      `Your appointment with Dr. ${appt.doctor.firstName} ${appt.doctor.lastName} has been booked.`,
    );
    // Notify doctor
    await this.notifications.create(
      appt.doctor.userId,
      `New appointment booked by ${patient.firstName} ${patient.lastName}.`,
    );

    return appt;
  }

  async cancelAppointment(userId: number, appointmentId: number) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');

    const appt = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appt) throw new NotFoundException('Appointment not found');
    if (appt.patientId !== patient.id) throw new BadRequestException('Not your appointment');
    if (new Date(appt.date) < new Date()) throw new BadRequestException('Cannot cancel a past appointment');

    const deleted = await this.prisma.appointment.delete({ where: { id: appointmentId } });

    // Notify patient
    await this.notifications.create(userId, `Your appointment has been cancelled.`);

    return deleted;
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
