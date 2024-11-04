import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff, StaffPosition } from './staff.entity';
import { StaffService } from './staff.service';
import { StaffSubordinate } from '../subordinates/staff_subordinates.entity';

describe('Testing staffService', () => {
  let service: StaffService;
  let staffRepository: Repository<Staff>;

  const mockStaffRepository = {
    insert: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };
  const employee1: Staff = {
    id: '1',
    name: 'Alice',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 3),
    ), // 3 years of service
    subordinates: [],
    supervisors: [],
  };

  const manager2: Staff = {
    id: '2',
    name: 'Bob',
    position: StaffPosition.MANAGER,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 5),
    ), // 5 years of service
    subordinates: [
      {
        supervisorId: '2',
        subordinateId: '3',
        supervisor: null,
        subordinate: null,
      } as StaffSubordinate,
    ],
    supervisors: [],
  };

  const subordinate3: Staff = {
    id: '3',
    name: 'Charlie',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 2),
    ), // 2 years of service
    subordinates: [],
    supervisors: [],
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: getRepositoryToken(Staff),
          useValue: mockStaffRepository,
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    staffRepository = module.get<Repository<Staff>>(getRepositoryToken(Staff));

    jest
      .spyOn(staffRepository, 'findOne')
      .mockImplementation(async (options) => {
        if (options.where !== null) {
          switch (options.where['id']) {
            case '1':
              return employee1;
            case '2':
              return manager2;
            case '3':
              return subordinate3;
          }
        }
      });
  });

  afterEach(() => {
    ///jest.clearAllMocks();
  });

  it('should calculate salary for an employee', async () => {
    const salary = await service.calculateSalary(employee1); /// employee1 years = 3
    expect(salary).toEqual(1090); // Base 1000 + 3 * 3% (9%)
  });

  it('Salary of manager with subordinates must equal 1255.3 with subordinate salary 1060', async () => {
    //// Charlie employee salary 1060
    //// Bob employee salary 1250 + 1060*0.005 =

    const managerSalary = await service.calculateSalary(manager2);
    const employeeSalary = await service.calculateSalary(subordinate3);
    expect(managerSalary).toEqual(1255.3);
    expect(employeeSalary).toEqual(1060);
  });
});
