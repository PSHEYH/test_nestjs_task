import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStafftDto } from './dto/create-staff.dto';
import { Staff } from './staff.entity';
import { StaffSalaryResponse } from './responses/staff-salary.response';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: 'Create staff' })
  @ApiBody({ type: CreateStafftDto })
  @ApiResponse({ status: 201, type: CreateStafftDto })
  @Post()
  async createStaff(@Body() dto: CreateStafftDto) {
    return await this.staffService.createStaff(dto);
  }

  @ApiOperation({ summary: 'Get all staff' })
  @ApiResponse({ status: 200, type: [Staff] })
  @Get()
  async getAllPosts() {
    return await this.staffService.findAll();
  }

  @ApiOperation({ summary: 'Delete staff by id' })
  @ApiParam({ name: 'id', description: 'Id of staff' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @HttpCode(204)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.staffService.deleteStaff(id);
  }

  @ApiOperation({ summary: 'Get staff salary by id' })
  @ApiParam({ name: 'id', description: 'Id of staff' })
  @ApiResponse({ status: 200, type: StaffSalaryResponse })
  @Get(':id')
  async getStaffSalaryById(@Param('id') id: string) {
    return await this.staffService.getStaffSalaryById(id);
  }
}
