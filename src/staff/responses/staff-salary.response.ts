import { ApiProperty } from '@nestjs/swagger';
import { StaffPosition } from '../staff.entity';

export class StaffSalaryResponse {
  @ApiProperty({ description: 'Id of created staff', type: String })
  id: string;

  @ApiProperty({ description: 'Position of staff', type: String })
  position: StaffPosition;

  @ApiProperty({ description: 'Name of staff', type: String })
  name: string;

  @ApiProperty({ description: 'Actual salary', type: Number })
  actual_salary: number;

  @ApiProperty({ description: 'Date of joining', type: String })
  joining_date: Date;
}
