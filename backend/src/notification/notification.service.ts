import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, message: string) {
    return this.prisma.notification.create({
      data: { userId, message },
    });
  }

  async getForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async markOneRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }
}
