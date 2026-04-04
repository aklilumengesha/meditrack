import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async rateDoctor(userId: number, appointmentId: number, rating: number, comment?: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient not found');

    const appointment = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.patientId !== patient.id) throw new BadRequestException('Not your appointment');
    if (appointment.status !== 'COMPLETED') throw new BadRequestException('Can only rate completed appointments');

    const existing = await this.prisma.doctorRating.findUnique({ where: { appointmentId } });
    if (existing) throw new BadRequestException('You have already rated this appointment');

    if (rating < 1 || rating > 5) throw new BadRequestException('Rating must be between 1 and 5');

    return this.prisma.doctorRating.create({
      data: { rating, comment, doctorId: appointment.doctorId, patientId: patient.id, appointmentId },
    });
  }

  async getDoctorRatings(doctorId: number) {
    const ratings = await this.prisma.doctorRating.findMany({
      where: { doctorId },
      include: { patient: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const avg = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
    return { ratings, average: parseFloat(avg.toFixed(1)), total: ratings.length };
  }

  async getDoctorAverageRating(doctorId: number) {
    const result = await this.prisma.doctorRating.aggregate({
      where: { doctorId },
      _avg: { rating: true },
      _count: true,
    });
    return { average: parseFloat((result._avg.rating || 0).toFixed(1)), total: result._count };
  }
}
