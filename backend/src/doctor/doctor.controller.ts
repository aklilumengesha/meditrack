import { Controller, Get, Put, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  @Roles(Role.ADMIN, Role.PATIENT)
  findAll() {
    return this.doctorService.findAll();
  }

  @Get('me')
  @Roles(Role.DOCTOR)
  getMyProfile(@Request() req) {
    return this.doctorService.findByUserId(req.user.id);
  }

  @Get('me/stats')
  @Roles(Role.DOCTOR)
  async getMyStats(@Request() req) {
    const doctor = await this.doctorService.findByUserId(req.user.id);
    return this.doctorService.getDashboardStats(doctor.id);
  }

  @Get('me/appointments')
  @Roles(Role.DOCTOR)
  async getMyAppointments(@Request() req) {
    const doctor = await this.doctorService.findByUserId(req.user.id);
    return this.doctorService.getDoctorAppointments(doctor.id);
  }

  @Get('me/patients')
  @Roles(Role.DOCTOR)
  async getMyPatients(@Request() req) {
    const doctor = await this.doctorService.findByUserId(req.user.id);
    return this.doctorService.getDoctorPatients(doctor.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.findOne(id);
  }

  @Put('me')
  @Roles(Role.DOCTOR)
  async updateMyProfile(@Request() req, @Body() dto: UpdateDoctorDto) {
    const doctor = await this.doctorService.findByUserId(req.user.id);
    return this.doctorService.update(doctor.id, dto);
  }
}
