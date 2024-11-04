import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffSubordinate } from './staff_subordinates.entity';
import { CreateStaffSubordinatetDto } from './dto/create-subordinate.dto';

@Injectable()
export class StaffSubordinatesService {
  constructor(
    @InjectRepository(StaffSubordinate)
    private readonly staffSubordinateRepository: Repository<StaffSubordinate>,
  ) {}

  async createStaffSubordinate(dto: CreateStaffSubordinatetDto) {
    const isExist = await this.staffSubordinateRepository.findOne({
      where: {
        subordinateId: dto.supervisorId,
        supervisorId: dto.subordinateId,
      },
    });
    if (isExist !== null) {
      throw new BadRequestException(
        'Supervisor entity has already been subordinate',
      );
    }

    return await this.staffSubordinateRepository.save(dto);
  }

  async findAllSubordinatesById(id: string) {
    const staffSubordinates = await this.staffSubordinateRepository.find({
      where: { supervisorId: id },
      relations: { subordinate: true },
    });

    const subordinates = staffSubordinates.map((e) => e.subordinate);
    return subordinates;
  }

  async deleteSubodrinate(dto: CreateStaffSubordinatetDto) {
    await this.staffSubordinateRepository.delete(dto);
  }
}
