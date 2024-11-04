import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStaffSubordinatetDto } from './dto/create-subordinate.dto';
import { StaffSubordinatesService } from './staff_subordinates.service';
import { Staff } from 'src/staff/staff.entity';
import { StaffSubordinateGuard } from 'src/guards/staff_subordinate.guard';

@Controller('staff-subordinates')
export class StaffSubordinateController {
  constructor(
    private readonly staffSubordinateService: StaffSubordinatesService,
  ) {}

  @ApiOperation({ summary: 'Create staff subordinate' })
  @ApiBody({ type: CreateStaffSubordinatetDto })
  @UseGuards(StaffSubordinateGuard)
  @ApiResponse({ status: 201, type: CreateStaffSubordinatetDto })
  @Post()
  async createStaffSubordinate(@Body() dto: CreateStaffSubordinatetDto) {
    return await this.staffSubordinateService.createStaffSubordinate(dto);
  }

  @ApiOperation({ summary: 'Get all first level subordinates' })
  @ApiResponse({ status: 200, type: [Staff] })
  @Get(':id')
  async getAllSubordinateById(@Param('id') id: string) {
    return await this.staffSubordinateService.findAllSubordinatesById(id);
  }

  @ApiOperation({ summary: 'Delete subordinate' })
  @ApiBody({ type: CreateStaffSubordinatetDto })
  @ApiResponse({ status: 204 })
  @Delete()
  async deleteSubordinate(@Body() dto: CreateStaffSubordinatetDto) {
    return await this.staffSubordinateService.deleteSubodrinate(dto);
  }
}
