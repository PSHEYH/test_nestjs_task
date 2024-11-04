import { ApiProperty } from '@nestjs/swagger';
import { StaffSubordinate } from '../subordinates/staff_subordinates.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

export enum StaffPosition {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  SALES = 'sales',
}

@Entity()
export class Staff {
  @ApiProperty({ type: String, description: 'Staff id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, description: 'Name of staff' })
  @Column({ type: 'text', nullable: false })
  name: string;

  @ApiProperty({ type: String, description: 'Position of staff' })
  @Column({ type: 'enum', enum: StaffPosition, nullable: false })
  position: StaffPosition;

  @ApiProperty({ type: String, description: 'Date of joining to company' })
  @Column({ type: 'timestamptz', nullable: false })
  joining_date: Date;

  @OneToMany(
    () => StaffSubordinate,
    (staffSubordinate) => staffSubordinate.supervisor,
  )
  subordinates: StaffSubordinate[];

  @OneToMany(
    () => StaffSubordinate,
    (StaffSubordinate) => StaffSubordinate.subordinate,
  )
  supervisors: StaffSubordinate[];
}
