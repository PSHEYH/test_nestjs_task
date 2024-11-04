import { ApiProperty } from '@nestjs/swagger';
import { Staff } from '../staff/staff.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class StaffSubordinate {
  @ApiProperty({ type: String, description: 'Supervisor id' })
  @PrimaryColumn({ type: 'uuid', nullable: false })
  supervisorId: string;

  @ApiProperty({ type: String, description: 'Subordinate id' })
  @PrimaryColumn({ type: 'uuid', nullable: false })
  subordinateId: string;

  @ManyToOne(() => Staff, (staff) => staff.subordinates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  supervisor: Staff;

  @ManyToOne(() => Staff, (staff) => staff.supervisors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ referencedColumnName: 'id' }])
  subordinate: Staff;
}
