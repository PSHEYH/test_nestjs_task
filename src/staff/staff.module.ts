import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { Staff } from './staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffSubordinateGuard } from 'src/guards/staff_subordinate.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Staff])],
  controllers: [StaffController],
  exports: [StaffService, StaffSubordinateGuard],
  providers: [StaffService, StaffSubordinateGuard],
})
export class StaffModule {}
