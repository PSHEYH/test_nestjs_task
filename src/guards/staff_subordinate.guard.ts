import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StaffPosition } from 'src/staff/staff.entity';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class StaffSubordinateGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly staffService: StaffService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const staff = await this.staffService.findById(request.body.supervisorId);
    if (staff.position == StaffPosition.EMPLOYEE) {
      throw new ForbiddenException('Employee cant be supervisor');
    }

    return true;
  }
}
