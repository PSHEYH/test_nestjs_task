import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff, StaffPosition } from './staff.entity';
import { CreateStafftDto } from './dto/create-staff.dto';
import { StaffSalaryResponse } from './responses/staff-salary.response';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  _defaultSalary = 1000;

  async createStaff(dto: CreateStafftDto) {
    const result = await this.staffRepository.insert(dto);
    return result.generatedMaps[0];
  }

  async findAll() {
    return await this.staffRepository.find();
  }

  async findById(id: string) {
    return await this.staffRepository.findOne({
      where: { id: id },
      select: {
        name: true,
        position: true,
        subordinates: true,
      },
    });
  }

  async deleteStaff(id: string) {
    return await this.staffRepository.delete({ id: id });
  }

  async calculateSubordinatesSalary(staff: Staff): Promise<number> {
    const today = new Date();
    let numberOfYears: number =
      today.getFullYear() - staff.joining_date.getFullYear();
    if (
      today.getMonth() < staff.joining_date.getMonth() ||
      (today.getMonth() === staff.joining_date.getMonth() &&
        today.getDate() < staff.joining_date.getDate())
    ) {
      numberOfYears--;
    }

    switch (staff.position) {
      case StaffPosition.EMPLOYEE:
        const additionalSalary =
          numberOfYears * 3 > 30
            ? this._defaultSalary * 0.3
            : this._defaultSalary * (numberOfYears * 0.03);
        return this._defaultSalary + additionalSalary;

      case StaffPosition.MANAGER:
        const additionalSalaryManagerByYears =
          numberOfYears * 5 > 40
            ? this._defaultSalary * 0.4
            : this._defaultSalary * (numberOfYears * 0.05);
        let additionalSalaryBySubordinates = 0;
        for (let i = 0; i < staff.subordinates.length; i++) {
          const subordinateStaffModel = await this.staffRepository.findOne({
            where: { id: staff.subordinates[i].subordinateId },
            relations: { subordinates: true },
          });
          additionalSalaryBySubordinates += await this.calculateSalary(
            subordinateStaffModel,
          );
        }

        let subordinateSumSalary = 0;
        for (let i = 0; i < staff.subordinates.length; i++) {
          const subordinateStaffModel = await this.staffRepository.findOne({
            where: { id: staff.subordinates[i].subordinateId },
            relations: { subordinates: true },
          });
          subordinateSumSalary += await this.calculateSubordinatesSalary(
            subordinateStaffModel,
          );
        }

        return (
          this._defaultSalary +
          additionalSalaryManagerByYears +
          additionalSalaryBySubordinates * 0.005 +
          subordinateSumSalary
        );
      case StaffPosition.SALES:
        const additionalSalarySalesByYears =
          numberOfYears > 35
            ? this._defaultSalary * 0.35
            : this._defaultSalary * (numberOfYears * 0.01);

        let addSalaryByAllSubordinates = 0;
        for (let i = 0; i < staff.subordinates.length; i++) {
          const subordinateStaffModel = await this.staffRepository.findOne({
            where: { id: staff.subordinates[i].subordinateId },
            relations: { subordinates: true },
          });
          addSalaryByAllSubordinates += await this.calculateSubordinatesSalary(
            subordinateStaffModel,
          );
        }

        return (
          this._defaultSalary +
          additionalSalarySalesByYears +
          addSalaryByAllSubordinates * 0.003 +
          addSalaryByAllSubordinates
        );
      default:
        throw new BadRequestException('Invalid position');
    }
  }

  async calculateSalary(staff: Staff): Promise<number> {
    const today = new Date();
    let numberOfYears: number =
      today.getFullYear() - staff.joining_date.getFullYear();
    if (
      today.getMonth() < staff.joining_date.getMonth() ||
      (today.getMonth() === staff.joining_date.getMonth() &&
        today.getDate() < staff.joining_date.getDate())
    ) {
      numberOfYears--;
    }

    switch (staff.position) {
      case StaffPosition.EMPLOYEE:
        const additionalSalary =
          numberOfYears * 3 > 30
            ? this._defaultSalary * 0.3
            : this._defaultSalary * (numberOfYears * 0.03);
        return this._defaultSalary + additionalSalary;

      case StaffPosition.MANAGER:
        const additionalSalaryManagerByYears =
          numberOfYears * 5 > 40
            ? this._defaultSalary * 0.4
            : this._defaultSalary * (numberOfYears * 0.05);

        let additionalSalaryBySubordinates = 0;
        for (let i = 0; i < staff.subordinates.length; i++) {
          const subordinateStaffModel = await this.staffRepository.findOne({
            where: { id: staff.subordinates[i].subordinateId },
            relations: { subordinates: true },
          });
          additionalSalaryBySubordinates += await this.calculateSalary(
            subordinateStaffModel,
          );
        }

        return (
          this._defaultSalary +
          additionalSalaryManagerByYears +
          additionalSalaryBySubordinates * 0.005
        );
      case StaffPosition.SALES:
        const additionalSalarySalesByYears =
          numberOfYears > 35
            ? this._defaultSalary * 0.35
            : this._defaultSalary * (numberOfYears * 0.01);

        let addSalaryBySubordinates = 0;
        for (let i = 0; i < staff.subordinates.length; i++) {
          const subordinateStaffModel = await this.staffRepository.findOne({
            where: { id: staff.subordinates[i].subordinateId },
            relations: { subordinates: true },
          });
          addSalaryBySubordinates += await this.calculateSubordinatesSalary(
            subordinateStaffModel,
          );
        }
        return (
          this._defaultSalary +
          additionalSalarySalesByYears +
          addSalaryBySubordinates * 0.003
        );
      default:
        throw new BadRequestException('Invalid position');
    }
  }

  async getStaffSalaryById(id: string) {
    const staff: Staff = await this.staffRepository.findOne({
      where: { id: id },
      relations: { subordinates: true },
    });

    if (staff == null) {
      throw new NotFoundException('Staff not found');
    }

    const result: StaffSalaryResponse = {
      id: staff.id,
      position: staff.position,
      name: staff.name,
      actual_salary: await this.calculateSalary(staff),
      joining_date: staff.joining_date,
    };

    return result;
  }
}
