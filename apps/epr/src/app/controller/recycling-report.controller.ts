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
  ParseFloatPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RecyclingReportService } from '../service/recycling-report.service';
import { CreateRecyclingReportDto } from '../dto/create-recycling-report.dto';
import { UpdateRecyclingReportDto } from '../dto/update-recycling-report.dto';
import { RecyclingReport } from '../entity/recycling-report.entity';

@ApiTags('Recycling Reports')
@Controller('recycling-reports')
export class RecyclingReportController {
  constructor(
    private readonly recyclingReportService: RecyclingReportService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new recycling report' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created recycling report',
    type: RecyclingReport,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided or validation error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found',
  })
  async create(
    @Body() createRecyclingReportDto: CreateRecyclingReportDto
  ): Promise<RecyclingReport> {
    return await this.recyclingReportService.create(createRecyclingReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recycling reports' })
  @ApiQuery({
    name: 'countryId',
    required: false,
    description: 'Filter by country ID',
    type: String,
  })
  @ApiQuery({
    name: 'minRecyclingRate',
    required: false,
    description: 'Filter by minimum recycling rate',
    type: Number,
  })
  @ApiQuery({
    name: 'maxRecyclingRate',
    required: false,
    description: 'Filter by maximum recycling rate',
    type: Number,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter from this reporting date (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter to this reporting date (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'legalTargetMet',
    required: false,
    description: 'Filter by legal target met status',
    type: Boolean,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved recycling reports',
    type: [RecyclingReport],
  })
  async findAll(
    @Query('countryId') countryId?: string,
    @Query('minRecyclingRate', new ParseFloatPipe({ optional: true }))
    minRecyclingRate?: number,
    @Query('maxRecyclingRate', new ParseFloatPipe({ optional: true }))
    maxRecyclingRate?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('legalTargetMet', new ParseBoolPipe({ optional: true }))
    legalTargetMet?: boolean
  ): Promise<RecyclingReport[]> {
    // Apply filters based on query parameters
    if (countryId) {
      return await this.recyclingReportService.findByCountryId(countryId);
    }

    if (minRecyclingRate !== undefined) {
      return await this.recyclingReportService.findByRecyclingRate(
        minRecyclingRate,
        maxRecyclingRate
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return await this.recyclingReportService.findByDateRange(start, end);
    }

    if (legalTargetMet !== undefined) {
      return await this.recyclingReportService.findByLegalTargetStatus(
        legalTargetMet
      );
    }

    return await this.recyclingReportService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get recycling report statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved statistics',
    schema: {
      type: 'object',
      properties: {
        totalReports: { type: 'number' },
        averageRecyclingRate: { type: 'number' },
        maxRecyclingRate: { type: 'number' },
        minRecyclingRate: { type: 'number' },
        totalWeight: { type: 'number' },
        legalTargetMetCount: { type: 'number' },
        legalTargetMetPercentage: { type: 'number' },
      },
    },
  })
  async getStatistics() {
    return await this.recyclingReportService.getRecyclingStatistics();
  }

  @Get('country/:countryId')
  @ApiOperation({ summary: 'Get recycling reports by country ID' })
  @ApiParam({ name: 'countryId', description: 'Country ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved recycling reports for country',
    type: [RecyclingReport],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found',
  })
  async findByCountryId(
    @Param('countryId', ParseUUIDPipe) countryId: string
  ): Promise<RecyclingReport[]> {
    return await this.recyclingReportService.findByCountryId(countryId);
  }

  @Get('rate/:minRate')
  @ApiOperation({ summary: 'Get recycling reports by recycling rate range' })
  @ApiParam({ name: 'minRate', description: 'Minimum recycling rate' })
  @ApiQuery({
    name: 'maxRate',
    required: false,
    description: 'Maximum recycling rate',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved recycling reports within rate range',
    type: [RecyclingReport],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid rate parameters',
  })
  async findByRecyclingRate(
    @Param('minRate', ParseFloatPipe) minRate: number,
    @Query('maxRate', new ParseFloatPipe({ optional: true })) maxRate?: number
  ): Promise<RecyclingReport[]> {
    return await this.recyclingReportService.findByRecyclingRate(
      minRate,
      maxRate
    );
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get recycling reports by date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved recycling reports within date range',
    type: [RecyclingReport],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid date parameters',
  })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<RecyclingReport[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.recyclingReportService.findByDateRange(start, end);
  }

  @Get('legal-target/:status')
  @ApiOperation({ summary: 'Get recycling reports by legal target status' })
  @ApiParam({
    name: 'status',
    description: 'Legal target met status (true/false)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Successfully retrieved recycling reports by legal target status',
    type: [RecyclingReport],
  })
  async findByLegalTargetStatus(
    @Param('status', ParseBoolPipe) status: boolean
  ): Promise<RecyclingReport[]> {
    return await this.recyclingReportService.findByLegalTargetStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recycling report by ID' })
  @ApiParam({ name: 'id', description: 'Recycling report ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved recycling report',
    type: RecyclingReport,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Recycling report not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<RecyclingReport> {
    return await this.recyclingReportService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update recycling report by ID' })
  @ApiParam({ name: 'id', description: 'Recycling report ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated recycling report',
    type: RecyclingReport,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Recycling report not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided or validation error',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRecyclingReportDto: UpdateRecyclingReportDto
  ): Promise<RecyclingReport> {
    return await this.recyclingReportService.update(
      id,
      updateRecyclingReportDto
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete recycling report by ID' })
  @ApiParam({ name: 'id', description: 'Recycling report ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted recycling report',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Recycling report not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.recyclingReportService.remove(id);
  }

  @Get(':id/validate')
  @ApiOperation({ summary: 'Validate if recycling report exists' })
  @ApiParam({ name: 'id', description: 'Recycling report ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Validation result',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean' },
      },
    },
  })
  async validateRecyclingReport(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<{ exists: boolean }> {
    const exists = await this.recyclingReportService.validateExists(id);
    return { exists };
  }
}
