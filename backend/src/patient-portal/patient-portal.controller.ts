import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { PatientPortalService } from './patient-portal.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { UpdatePatientProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('patient-portal')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PATIENT)
export class PatientPortalController {
  constructor(private readonly service: PatientPortalService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.service.getDashboardSummary(req.user.id);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.service.getProfile(req.user.id);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() dto: UpdatePatientProfileDto) {
    return this.service.updateProfile(req.user.id, dto);
  }

  @Get('appointments')
  getAppointments(@Request() req) {
    return this.service.getMyAppointments(req.user.id);
  }

  @Post('appointments')
  bookAppointment(@Request() req, @Body() dto: BookAppointmentDto) {
    return this.service.bookAppointment(req.user.id, dto);
  }

  @Delete('appointments/:id')
  cancelAppointment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.cancelAppointment(req.user.id, id);
  }

  @Get('medical-records')
  getMedicalRecords(@Request() req) {
    return this.service.getMyMedicalRecords(req.user.id);
  }
}
