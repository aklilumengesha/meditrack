import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  getAll(@Request() req) {
    return this.service.getForUser(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.service.getUnreadCount(req.user.id);
  }

  @Patch('read-all')
  markAllRead(@Request() req) {
    return this.service.markAllRead(req.user.id);
  }

  @Patch(':id/read')
  markOneRead(@Param('id', ParseIntPipe) id: number) {
    return this.service.markOneRead(id);
  }
}
