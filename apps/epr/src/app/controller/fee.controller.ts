import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { FeeService } from '../service/fee.service';
import { CreateFeeDto } from '../dto/create-fee.dto';
import { UpdateFeeDto } from '../dto/update-fee.dto';
import { Fee } from '../entity/fee.entity';
import { IsOptional, IsString } from 'class-validator';
import {
  FeeStatistics,
  FeeByMaterialStatistics,
} from '../interfaces/fee-statistics.interface';
import { MaterialType } from '../enums/material-type.enum';

class MarkAsPaidDto {
  @IsOptional()
  @IsString()
  reportUrl?: string;
}

@ApiTags('Fees')
@Controller('fees')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create new fee' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created',
    type: Fee,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or payment date in future',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found',
  })
  async create(@Body() createFeeDto: CreateFeeDto): Promise<Fee> {
    return await this.feeService.create(createFeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fees' })
  @ApiQuery({
    name: 'countryId',
    required: false,
    description: 'Filter by country ID',
  })
  @ApiQuery({
    name: 'material',
    required: false,
    description: 'Filter by material type',
    enum: ['Plastic', 'Cardboard', 'Metal', 'Glass', 'Other'],
  })
  @ApiQuery({
    name: 'isPaid',
    required: false,
    description: 'Filter by payment status',
    type: Boolean,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for date range filter (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for date range filter (YYYY-MM-DD)',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved',
    type: [Fee],
  })
  async findAll(
    @Query('countryId') countryId?: string,
    @Query('material') material?: MaterialType,
    @Query('isPaid') isPaid?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<Fee[]> {
    // Date range filter
    if (startDate && endDate) {
      return await this.feeService.findFeesByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    }

    // Combined filters
    if (countryId && material) {
      return await this.feeService.findByCountryAndMaterial(
        countryId,
        material
      );
    }

    // Single filters
    if (countryId) {
      return await this.feeService.findByCountry(countryId);
    }

    if (material) {
      return await this.feeService.findByMaterial(material);
    }

    if (isPaid === 'true') {
      return await this.feeService.findPaidFees();
    }

    if (isPaid === 'false') {
      return await this.feeService.findUnpaidFees();
    }

    return await this.feeService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get fee statistics' })
  @ApiQuery({
    name: 'countryId',
    required: false,
    description: 'Filter statistics by country',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved statistics',
    type: FeeStatistics,
  })
  async getStatistics(
    @Query('countryId') countryId?: string
  ): Promise<FeeStatistics> {
    return await this.feeService.getFeeStatistics(countryId);
  }

  @Get('statistics/materials')
  @ApiOperation({ summary: 'Get fee statistics grouped by material type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved material statistics',
    type: [FeeByMaterialStatistics],
  })
  async getMaterialStatistics(): Promise<FeeByMaterialStatistics[]> {
    return await this.feeService.getFeesByMaterialStatistics();
  }

  @Get('country/:countryId/totals')
  @ApiOperation({ summary: 'Get total amounts for a specific country' })
  @ApiParam({ name: 'countryId', description: 'Country ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved totals',
    schema: {
      type: 'object',
      properties: {
        totalAmount: { type: 'number' },
        paidAmount: { type: 'number' },
        unpaidAmount: { type: 'number' },
      },
    },
  })
  async getCountryTotals(@Param('countryId', ParseUUIDPipe) countryId: string) {
    return await this.feeService.calculateTotalAmountForCountry(countryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fee by ID' })
  @ApiParam({ name: 'id', description: 'Fee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved',
    type: Fee,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Fee not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Fee> {
    return await this.feeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fee by ID' })
  @ApiParam({ name: 'id', description: 'Fee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated',
    type: Fee,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Fee not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or payment date in future',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFeeDto: UpdateFeeDto
  ): Promise<Fee> {
    return await this.feeService.update(id, updateFeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fee by ID' })
  @ApiParam({ name: 'id', description: 'Fee ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Fee not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.feeService.remove(id);
  }

  @Put(':id/mark-paid')
  @ApiOperation({ summary: 'Mark fee as paid' })
  @ApiParam({ name: 'id', description: 'Fee ID' })
  @ApiBody({
    type: MarkAsPaidDto,
    required: false,
    description: 'Optional report URL',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully marked as paid',
    type: Fee,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Fee not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Fee is already paid',
  })
  async markAsPaid(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body?: MarkAsPaidDto
  ): Promise<Fee> {
    return await this.feeService.markAsPaid(id, body?.reportUrl);
  }

  @Put(':id/mark-unpaid')
  @ApiOperation({ summary: 'Mark fee as unpaid' })
  @ApiParam({ name: 'id', description: 'Fee ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully marked as unpaid',
    type: Fee,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Fee not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Fee is already unpaid',
  })
  async markAsUnpaid(@Param('id', ParseUUIDPipe) id: string): Promise<Fee> {
    return await this.feeService.markAsUnpaid(id);
  }
}
