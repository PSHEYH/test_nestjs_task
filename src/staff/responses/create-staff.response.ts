import { ApiProperty } from '@nestjs/swagger';
import { StaffPosition } from '../staff.entity';

export class CreateStaffResponse {
  @ApiProperty({ description: 'Id of created staff', type: String })
  id: string;

  @ApiProperty({ description: 'Position of staff', type: String })
  position: StaffPosition;
}
