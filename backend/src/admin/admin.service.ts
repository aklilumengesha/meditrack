import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ─── STATS ───────────────────────────────────────────────────────────────────

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, totalDoctors, totalPatients, totalAppointments, totalRecords,
      newUsersThisMonth, appointmentsThisMonth, recentActivity] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.doctor.count(),
      this.prisma.patient.count(),
      this.prisma.appointment.count(),
      this.prisma.medicalRecord.count(),
      this.prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.appointment.count({ where: { date: { gte: startOfMonth } } }),
      this.prisma.user.findMany({
        take: 10, orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, role: true, createdAt: true,
          doctor: { select: { firstName: true, lastName: true } },
          patient: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    return { totalUsers, totalDoctors, totalPatients, totalAppointments, totalRecords,
      newUsersThisMonth, appointmentsThisMonth, recentActivity };
  }

  async getMonthlyStats() {
    const appointments = await this.prisma.$queryRaw`
      SELECT DATE_TRUNC('month', date) as month, COUNT(*) as count
      FROM "Appointment"
      GROUP BY month ORDER BY month DESC LIMIT 6
    `;
    const users = await this.prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(*) as count
      FROM "User"
      GROUP BY month ORDER BY month DESC LIMIT 6
    `;
    return { appointments, users };
  }

  // ─── USERS ───────────────────────────────────────────────────────────────────

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, active: true, createdAt: true,
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
        patient: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleUserActive(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.prisma.user.update({ where: { id }, data: { active: !user.active } });
  }

  async changeUserRole(id: number, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.prisma.user.update({ where: { id }, data: { role: role as any } });
  }

  async resetUserPassword(id: number, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({ where: { id }, data: { password: hashed } });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.prisma.user.delete({ where: { id } });
  }

  // ─── DOCTORS ─────────────────────────────────────────────────────────────────

  async getAllDoctors() {
    return this.prisma.doctor.findMany({
      include: { user: { select: { email: true, active: true, createdAt: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  async createDoctor(data: { email: string; password: string; firstName: string; lastName: string; specialty: string; phone?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already in use');
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({ data: { email: data.email, password: hashed, role: 'DOCTOR' } });
    return this.prisma.doctor.create({
      data: { firstName: data.firstName, lastName: data.lastName, specialty: data.specialty, phone: data.phone, userId: user.id },
    });
  }

  async updateDoctor(id: number, data: { firstName?: string; lastName?: string; specialty?: string; phone?: string }) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException(`Doctor ${id} not found`);
    return this.prisma.doctor.update({ where: { id }, data });
  }

  async getDoctorAppointments(id: number) {
    return this.prisma.appointment.findMany({
      where: { doctorId: id },
      include: { patient: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' },
    });
  }

  // ─── PATIENTS ────────────────────────────────────────────────────────────────

  async getAllPatients() {
    return this.prisma.patient.findMany({
      include: { user: { select: { email: true, active: true, createdAt: true } } },
      orderBy: { lastName: 'asc' },
    });
  }

  async updatePatient(id: number, data: { firstName?: string; lastName?: string; birthDate?: string; address?: string }) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);
    return this.prisma.patient.update({
      where: { id },
      data: { ...data, birthDate: data.birthDate ? new Date(data.birthDate) : undefined },
    });
  }

  async getPatientMedicalRecords(id: number) {
    return this.prisma.medicalRecord.findMany({
      where: { patientId: id },
      orderBy: { date: 'desc' },
    });
  }

  // ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

  async getAllAppointments() {
    return this.prisma.appointment.findMany({
      include: {
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async createAppointment(data: { patientId: number; doctorId: number; date: string; startTime: string; reason?: string }) {
    return this.prisma.appointment.create({
      data: {
        date: new Date(data.date), startTime: new Date(data.startTime),
        reason: data.reason,
        patient: { connect: { id: data.patientId } },
        doctor: { connect: { id: data.doctorId } },
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async updateAppointment(id: number, data: { date?: string; startTime?: string; reason?: string }) {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException(`Appointment ${id} not found`);
    return this.prisma.appointment.update({
      where: { id },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        reason: data.reason,
      },
    });
  }

  async deleteAppointment(id: number) {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException(`Appointment ${id} not found`);
    return this.prisma.appointment.delete({ where: { id } });
  }

  // ─── MEDICAL RECORDS ─────────────────────────────────────────────────────────

  async getAllMedicalRecords() {
    return this.prisma.medicalRecord.findMany({
      include: { patient: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async deleteMedicalRecord(id: number) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Record ${id} not found`);
    return this.prisma.medicalRecord.delete({ where: { id } });
  }

  // ─── SETTINGS ────────────────────────────────────────────────────────────────

  async getSpecialties() {
    const doctors = await this.prisma.doctor.findMany({ select: { specialty: true }, distinct: ['specialty'] });
    return doctors.map(d => d.specialty);
  }
}
