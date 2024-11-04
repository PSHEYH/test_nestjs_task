import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff, StaffPosition } from './staff.entity';
import { StaffService } from './staff.service';
import { StaffSubordinate } from '../subordinates/staff_subordinates.entity';
import { NotFoundException } from '@nestjs/common';

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

  const employee3Years = {
    id: 'employee3Years',
    name: 'employee3Years',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 3),
    ), // 3 years of service
    subordinates: [],
    supervisors: [],
  };
  const employee4Years = {
    id: 'employee4years',
    name: 'employee4years',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 4),
    ), // 3 years of service
    subordinates: [],
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

  const employee5Years: Staff = {
    id: 'employee5Years',
    name: 'employee5Years',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 5),
    ),
    subordinates: [],
    supervisors: [],
  };

  const oldEmployee: Staff = {
    id: 'old_employee',
    name: 'Old employee',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 11),
    ), // 3 years of service
    subordinates: [],
    supervisors: [],
  };

  const oldManager: Staff = {
    id: 'old_manager',
    name: 'Old manager',
    position: StaffPosition.MANAGER,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 10),
    ), // 3 years of service
    subordinates: [],
    supervisors: [],
  };

  const oldSales: Staff = {
    id: 'old_sales',
    name: 'Old sales',
    position: StaffPosition.SALES,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 36),
    ),
    subordinates: [],
    supervisors: [],
  };

  const subordinateEmployee2Years: Staff = {
    id: 'subordinateEmployee2Years',
    name: 'subordinateEmployee2Years',
    position: StaffPosition.EMPLOYEE,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 2),
    ), // 2 years of service
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
        subordinateId: 'subordinateEmployee2Years',
        subordinate: subordinateEmployee2Years,
      } as StaffSubordinate,
    ],
    supervisors: [],
  };

  const manager2YearsWithEmployees3_2_4Years: Staff = {
    id: 'manager2_yearsEmployee3_2_4years',
    name: 'manager2_yearsEmployee3_2_4years',
    position: StaffPosition.MANAGER,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 2),
    ), // 5 years of service
    subordinates: [
      {
        supervisorId: 'manager2_yearsEmployee3_2_4years',
        subordinateId: employee3Years.id,
      } as StaffSubordinate,
      {
        supervisorId: 'manager2_yearsEmployee3_2_4years',
        subordinateId: employee4Years.id,
      } as StaffSubordinate,
      {
        supervisorId: 'manager2_yearsEmployee3_2_4years',
        subordinateId: employee2Years.id,
      } as StaffSubordinate,
    ],
    supervisors: [],
  };

  const manager3YearsWithEmployee5YearsManager2YearsWith3Employees: Staff = {
    id: 'manager3_yearsEmployeeAndManager2Years3Employees',
    name: 'manager3_yearsEmployeeAndManager2Years3Employees',
    position: StaffPosition.MANAGER,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 3),
    ),
    subordinates: [
      {
        supervisorId: 'manager3_yearsEmployeeAndManager2Years3Employees',
        subordinateId: manager2YearsWithEmployees3_2_4Years.id,
      } as StaffSubordinate,
      {
        supervisorId: 'manager3_yearsEmployeeAndManager2Years3Employees',
        subordinateId: employee5Years.id,
      } as StaffSubordinate,
    ],
    supervisors: [],
  };

  const sales2YearsWithManager3AndManager2: Staff = {
    id: 'sales2YearsManager3Manager2',
    name: 'sales2YearsManager3Manager2',
    position: StaffPosition.SALES,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 2),
    ),
    subordinates: [
      {
        supervisorId: 'sales2YearsManager3Manager2',
        subordinateId: manager2YearsWithEmployees3_2_4Years.id,
      } as StaffSubordinate,
      {
        supervisorId: 'sales2YearsManager3Manager2',
        subordinateId:
          manager3YearsWithEmployee5YearsManager2YearsWith3Employees.id,
      } as StaffSubordinate,
    ],
    supervisors: [],
  };

  const sales4YearsWithSales2YearsAndManager5 = {
    id: 'sales4YearsWithSales2YearsAndManager5',
    name: 'sales4YearsWithSales2YearsAndManager5',
    position: StaffPosition.SALES,
    joining_date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 4),
    ),
    subordinates: [
      {
        supervisorId: 'sales4YearsWithSales2YearsAndManager5',
        subordinateId: sales2YearsWithManager3AndManager2.id,
      } as StaffSubordinate,
      {
        supervisorId: 'sales4YearsWithSales2YearsAndManager5',
        subordinateId: manager5Years.id,
      } as StaffSubordinate,
    ],
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
            case employee1.id:
              return employee1;
            case manager5Years.id:
              return manager5Years;
            case subordinateEmployee2Years.id:
              return subordinateEmployee2Years;
            case oldEmployee.id:
              return oldEmployee;
            case oldManager.id:
              return oldManager;
            case oldSales.id:
              return oldSales;
            case employee3Years.id:
              return employee3Years;
            case employee2Years.id:
              return employee2Years;
            case employee4Years.id:
              return employee4Years;
            case employee5Years.id:
              return employee5Years;
            case manager2YearsWithEmployees3_2_4Years.id:
              return manager2YearsWithEmployees3_2_4Years;
            case manager3YearsWithEmployee5YearsManager2YearsWith3Employees.id:
              return manager3YearsWithEmployee5YearsManager2YearsWith3Employees;
            case sales2YearsWithManager3AndManager2.id:
              return sales2YearsWithManager3AndManager2;
            case sales4YearsWithSales2YearsAndManager5.id:
              return sales4YearsWithSales2YearsAndManager5;
            default:
              return null;
          }
        }
      });
  });

  afterEach(() => {
    ///jest.clearAllMocks();
  });

  it('Trying to get salary of non existing staff. Throw NotFound exception.', async () => {
    expect(() => service.getStaffSalaryById('adfsfa')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Should calculate salary for an employee. Employee with 3 years will get 9 % from 1000. Salary equal 1090', async () => {
    const salary = await service.getStaffSalaryById(employee1.id); /// employee1 years = 3
    expect(salary.actual_salary).toEqual(1090); // Base 1000 + 3 * 3% (9%)
  });

  it('Should calculate salary for an employee. Employee can have max 30 % from bonus salary. Salary equal 1300', async () => {
    const salary = await service.getStaffSalaryById(oldEmployee.id);
    expect(salary.actual_salary).toEqual(1300);
  });
  it('Should calculate salary for an manager. Manager can have max 40 % from bonus salary from years. Salary equal 1400', async () => {
    const salary = await service.getStaffSalaryById(oldManager.id);
    expect(salary.actual_salary).toEqual(1400);
  });
  it('Should calculate salary for an manager. Sales can have max 35 % from bonus year salary from years. Salary equal 1350', async () => {
    const salary = await service.getStaffSalaryById(oldSales.id);
    expect(salary.actual_salary).toEqual(1350);
  });

  it('Salary of manager with subordinates must equal 1255.3 with subordinate salary 1060', async () => {
    const managerSalary = await service.getStaffSalaryById(manager5Years.id);
    const employeeSalary = await service.getStaffSalaryById(
      subordinateEmployee2Years.id,
    );
    expect(managerSalary.actual_salary).toEqual(1255.3);
    expect(employeeSalary.actual_salary).toEqual(1060);
  });

  it('Should calculate salary for an manager. Manager with 2 working years and 3 Employee with 2,3 and 4 years will have (1060+1090+1120)*0.005+1100 = 1116.35', async () => {
    const manageSalary = await service.getStaffSalaryById(
      manager2YearsWithEmployees3_2_4Years.id,
    );
    const employee2Salary = await service.getStaffSalaryById(employee2Years.id);
    const employee3Salary = await service.getStaffSalaryById(employee3Years.id);
    const employee4Salary = await service.getStaffSalaryById(employee4Years.id);
    expect(employee2Salary.actual_salary).toEqual(1060);
    expect(employee3Salary.actual_salary).toEqual(1090);
    expect(employee4Salary.actual_salary).toEqual(1120);
    expect(manageSalary.actual_salary).toEqual(
      (1060 + 1120 + 1090) * 0.005 + 1100,
    );
  });

  it(`Should calculate salary for an manager.
      Manager with 3 years and with subordinates: Manager 2 Years 3 employess and Employee should get bonus payment only from first level subordinates.
      1150 + (1116.35(prev manager) + 1150(Employee 5 years))*0.005 = 1161.33175`, async () => {
    const managerSalary = await service.getStaffSalaryById(
      manager3YearsWithEmployee5YearsManager2YearsWith3Employees.id,
    );
    const employee5Salary = await service.getStaffSalaryById(employee5Years.id);
    expect(employee5Salary.actual_salary).toEqual(1150);
    expect(managerSalary.actual_salary).toEqual(
      1150 + (1116.35 + 1150) * 0.005,
    );
  });

  it(`Should calculate salary for an sales. 
      Sales with 2 years and with subordinates: Manager 2 Years(3 employess) and Manager 3 Years(Manager 2 Years(3 employee) and 1 employee) should get right bonus payment. 
      1020 (without sub bonus) + ((1060+1090+1120+1116.35) (Manager 2 Years) + (1060+1090+1120+1116.35+1161.33175+1150) (Manager 3 Years))*0.003 = 1053.25209525`, async () => {
    const salesSalary = await service.getStaffSalaryById(
      sales2YearsWithManager3AndManager2.id,
    );

    expect(salesSalary.actual_salary).toEqual(
      1020 +
        (1060 +
          1090 +
          1120 +
          1116.35 +
          (1060 + 1090 + 1120 + 1116.35 + 1161.33175 + 1150)) *
          0.003,
    );
  });

  it(`Should calculate salary for an sales. 
      Sales with 4 years and with subordinates: Sales 2 Years(From prev test) and Manager 5 Years(1 Employee 2 years) should get right bonus payment. 
      1040 (without sub bonus) + ((1060+1090+1120+1116.35) (Manager 2 Years) + (1060+1090+1120+1116.35+1161.33175+1150) (Manager 3 Years) + 1155(Sales) + 1250+1060*0.005+1060)*0.003`, async () => {
    const salesSalary = await service.getStaffSalaryById(
      sales4YearsWithSales2YearsAndManager5.id,
    );

    expect(salesSalary.actual_salary).toEqual(
      1040 +
        (1060 +
          1090 +
          1120 +
          1116.35 +
          (1060 + 1090 + 1120 + 1116.35 + 1161.33175 + 1150) +
          1053.25209525 +
          1255.3 +
          1060) *
          0.003,
    );
  });
});
