import { Controller, Get, Post, Put, Delete, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Stats
  @Get('stats') getStats() { return this.adminService.getStats(); }
  @Get('stats/monthly') getMonthlyStats() { return this.adminService.getMonthlyStats(); }

  // Users
  @Get('users') getAllUsers() { return this.adminService.getAllUsers(); }
  @Delete('users/:id') deleteUser(@Param('id', ParseIntPipe) id: number) { return this.adminService.deleteUser(id); }
  @Patch('users/:id/toggle-active') toggleActive(@Param('id', ParseIntPipe) id: number) { return this.adminService.toggleUserActive(id); }
  @Patch('users/:id/role') changeRole(@Param('id', ParseIntPipe) id: number, @Body() body: { role: string }) { return this.adminService.changeUserRole(id, body.role); }
  @Patch('users/:id/reset-password') resetPassword(@Param('id', ParseIntPipe) id: number) { return this.adminService.resetUserPassword(id); }

  // Doctors
  @Get('doctors') getAllDoctors() { return this.adminService.getAllDoctors(); }
  @Post('doctors') createDoctor(@Body() body: any) { return this.adminService.createDoctor(body); }
  @Put('doctors/:id') updateDoctor(@Param('id', ParseIntPipe) id: number, @Body() body: any) { return this.adminService.updateDoctor(id, body); }
  @Get('doctors/:id/appointments') getDoctorAppointments(@Param('id', ParseIntPipe) id: number) { return this.adminService.getDoctorAppointments(id); }

  // Patients
  @Get('patients') getAllPatients() { return this.adminService.getAllPatients(); }
  @Put('patients/:id') updatePatient(@Param('id', ParseIntPipe) id: number, @Body() body: any) { return this.adminService.updatePatient(id, body); }
  @Get('patients/:id/records') getPatientRecords(@Param('id', ParseIntPipe) id: number) { return this.adminService.getPatientMedicalRecords(id); }

  // Appointments
  @Get('appointments') getAllAppointments() { return this.adminService.getAllAppointments(); }
  @Post('appointments') createAppointment(@Body() body: any) { return this.adminService.createAppointment(body); }
  @Put('appointments/:id') updateAppointment(@Param('id', ParseIntPipe) id: number, @Body() body: any) { return this.adminService.updateAppointment(id, body); }
  @Delete('appointments/:id') deleteAppointment(@Param('id', ParseIntPipe) id: number) { return this.adminService.deleteAppointment(id); }

  // Medical Records
  @Get('medical-records') getAllRecords() { return this.adminService.getAllMedicalRecords(); }
  @Delete('medical-records/:id') deleteRecord(@Param('id', ParseIntPipe) id: number) { return this.adminService.deleteMedicalRecord(id); }

  // Settings
  @Get('specialties') getSpecialties() { return this.adminService.getSpecialties(); }
}
