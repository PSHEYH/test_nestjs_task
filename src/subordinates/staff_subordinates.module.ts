import { Module } from '@nestjs/common';
import { StaffSubordinateController } from './staff_subordinates.controller';
import { StaffSubordinatesService } from './staff_subordinates.service';
import { StaffSubordinate } from './staff_subordinates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [TypeOrmModule.forFeature([StaffSubordinate]), StaffModule],
  controllers: [StaffSubordinateController],
  providers: [StaffSubordinatesService],
})
export class StaffSubordinatesModule {}
