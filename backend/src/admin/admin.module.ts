import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
