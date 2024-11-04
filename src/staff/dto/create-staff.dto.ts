import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';
import { StaffPosition } from '../staff.entity';

export class CreateStafftDto {
  @ApiProperty({ type: String, description: 'Name of staff' })
  @IsString()
  name: string;
  @ApiProperty({
    type: 'text',
    description: 'Position of staff',
    required: false,
  })
  @IsEnum(StaffPosition)
  position: StaffPosition;

  @ApiProperty({ type: Date, description: 'Date of joining to company' })
  @IsDateString()
  joining_date: Date;
}
