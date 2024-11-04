import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateStaffSubordinatetDto {
  @ApiProperty({ type: String, description: 'Supervisor id' })
  @IsUUID()
  supervisorId: string;
  @ApiProperty({
    type: String,
    description: 'Subordinate id',
  })
  @IsUUID()
  subordinateId: string;
}
