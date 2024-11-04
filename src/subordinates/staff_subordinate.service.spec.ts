import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff, StaffPosition } from '../staff/staff.entity';
import { StaffSubordinate } from '../subordinates/staff_subordinates.entity';
import { StaffSubordinatesService } from './staff_subordinates.service';
import { BadRequestException } from '@nestjs/common';

describe('Testing staffSubordinateService', () => {
  let service: StaffSubordinatesService;
  let staffSubordinateRepository: Repository<StaffSubordinate>;

  const mockStaffRepository = {
    insert: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };
  const employee3Years: Staff = {
    id: 'employee3Years',
    name: 'employee3Years',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 3),
    ), // 3 years of service
    subordinates: [],
    supervisors: [],
  };

  const manager5Years: Staff = {
    id: 'manager5Years',
    name: 'manager5Years',
    position: StaffPosition.MANAGER,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 5),
    ), // 5 years of service
    subordinates: [
      {
        supervisorId: 'manager5Years',
        subordinateId: employee3Years.id,
      } as StaffSubordinate,
    ],
    supervisors: [],
  };

  const employee2Years = {
    id: 'employee2years',
    name: 'employee2years',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 2),
    ), // 3 years of service
    subordinates: [],
    supervisors: [],
  };

  const manager2Years: Staff = {
    id: 'manager2Years',
    name: 'manager2Years',
    position: StaffPosition.MANAGER,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 2),
    ), // 5 years of service
    subordinates: [],
    supervisors: [],
  };

  const staffSubordinates = [
    {
      subordinateId: employee3Years.id,
      supervisorId: manager5Years.id,
      subordinate: employee3Years,
    } as StaffSubordinate,
    {
      subordinateId: employee2Years.id,
      supervisorId: manager5Years.id,
      subordinate: employee2Years,
    } as StaffSubordinate,
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffSubordinatesService,
        {
          provide: getRepositoryToken(StaffSubordinate),
          useValue: mockStaffRepository,
        },
      ],
    }).compile();

    service = module.get<StaffSubordinatesService>(StaffSubordinatesService);
    staffSubordinateRepository = module.get<Repository<StaffSubordinate>>(
      getRepositoryToken(StaffSubordinate),
    );

    jest
      .spyOn(staffSubordinateRepository, 'findOne')
      .mockImplementation(async (options) => {
        if (options.where !== null) {
          const result = staffSubordinates.find(
            (el) =>
              el.subordinateId === options.where['subordinateId'] &&
              el.supervisorId === options.where['supervisorId'],
          );
          return result == undefined ? null : result;
        }
      });

    jest
      .spyOn(staffSubordinateRepository, 'find')
      .mockImplementation(async (options) => {
        if (options.where !== null) {
          return staffSubordinates.filter(
            (el) => el.supervisorId == options.where['supervisorId'],
          );
        }
      });
  });

  afterEach(() => {
    ///jest.clearAllMocks();
  });

  it('Get subordinates of manager 5. Result 2 subordinates: Employee2 Employee3', async () => {
    const subordinatesManager = await service.findAllSubordinatesById(
      manager5Years.id,
    );

    expect(subordinatesManager).toEqual([employee3Years, employee2Years]);
  });

  it('Get subordinates of manager 2. Empty', async () => {
    const subordinatesManager = await service.findAllSubordinatesById(
      manager2Years.id,
    );

    expect(subordinatesManager).toEqual([]);
  });

  it('Create staffSubordinate -> return staffSubordinate', async () => {
    jest.spyOn(staffSubordinateRepository, 'save').mockResolvedValue({
      subordinateId: employee3Years.id,
      supervisorId: manager2Years.id,
    } as StaffSubordinate);
    const staffSubordinate = await service.createStaffSubordinate({
      subordinateId: employee3Years.id,
      supervisorId: manager2Years.id,
    });

    expect(staffSubordinate).toEqual({
      subordinateId: employee3Years.id,
      supervisorId: manager2Years.id,
    });
  });

  it('Cant create staffSubordinate if supervisorId has already been subordinate', async () => {
    expect(() =>
      service.createStaffSubordinate({
        subordinateId: manager5Years.id,
        supervisorId: employee3Years.id,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
