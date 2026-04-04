import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { RatingService } from './rating.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('appointments/:appointmentId')
  @UseGuards(RolesGuard)
  @Roles(Role.PATIENT)
  rateDoctor(
    @Request() req,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() body: { rating: number; comment?: string },
  ) {
    return this.ratingService.rateDoctor(req.user.id, appointmentId, body.rating, body.comment);
  }

  @Get('doctors/:doctorId')
  getDoctorRatings(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.ratingService.getDoctorRatings(doctorId);
  }

  @Get('doctors/:doctorId/average')
  getDoctorAverage(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.ratingService.getDoctorAverageRating(doctorId);
  }
}
