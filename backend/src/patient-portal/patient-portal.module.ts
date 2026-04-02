import { Module } from '@nestjs/common';
import { PatientPortalService } from './patient-portal.service';
import { PatientPortalController } from './patient-portal.controller';
import { CoreModule } from '../core/core.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [CoreModule, NotificationModule],
  controllers: [PatientPortalController],
  providers: [PatientPortalService],
})
export class PatientPortalModule {}
