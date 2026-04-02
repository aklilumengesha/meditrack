import { Controller, Get, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
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

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Delete('users/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('doctors')
  getAllDoctors() {
    return this.adminService.getAllDoctors();
  }

  @Get('patients')
  getAllPatients() {
    return this.adminService.getAllPatients();
  }

  @Get('appointments')
  getAllAppointments() {
    return this.adminService.getAllAppointments();
  }

  @Delete('appointments/:id')
  deleteAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAppointment(id);
  }
}
