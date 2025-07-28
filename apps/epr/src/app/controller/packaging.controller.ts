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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PackagingService } from '../service/packaging.service';
import { CreatePackagingDto } from '../dto/create-packaging.dto';
import { UpdatePackagingDto } from '../dto/update-packaging.dto';
import { Packaging } from '../entity/packaging.entity';

@ApiTags('Packaging')
@Controller('packaging')
export class PackagingController {
  constructor(private readonly packagingService: PackagingService) {}

  @Post()
  @ApiOperation({ summary: 'Create new packaging record' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created',
    type: Packaging,
  })
  async create(
    @Body() createPackagingDto: CreatePackagingDto
  ): Promise<Packaging> {
    return await this.packagingService.create(createPackagingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packaging records' })
  @ApiQuery({
    name: 'countryId',
    required: false,
    description: 'Filter by country ID',
  })
  @ApiQuery({
    name: 'materialType',
    required: false,
    description: 'Filter by material type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved',
    type: [Packaging],
  })
  async findAll(
    @Query('countryId') countryId?: string,
    @Query('materialType') materialType?: string
  ): Promise<Packaging[]> {
    if (countryId) {
      return await this.packagingService.findByCountry(countryId);
    }
    if (materialType) {
      return await this.packagingService.findByMaterialType(materialType);
    }
    return await this.packagingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get packaging by ID' })
  @ApiParam({ name: 'id', description: 'Packaging ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved',
    type: Packaging,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Packaging not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Packaging> {
    return await this.packagingService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update packaging by ID' })
  @ApiParam({ name: 'id', description: 'Packaging ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated',
    type: Packaging,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Packaging not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePackagingDto: UpdatePackagingDto
  ): Promise<Packaging> {
    return await this.packagingService.update(id, updatePackagingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete packaging by ID' })
  @ApiParam({ name: 'id', description: 'Packaging ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Packaging not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.packagingService.remove(id);
  }

  @Get('statistics/overview')
  @ApiOperation({ summary: 'Get packaging statistics' })
  @ApiQuery({
    name: 'countryId',
    required: false,
    description: 'Filter statistics by country',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved statistics',
  })
  async getStatistics(@Query('countryId') countryId?: string) {
    return await this.packagingService.getPackagingStatistics(countryId);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Mark packaging as completed' })
  @ApiParam({ name: 'id', description: 'Packaging ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully marked as completed',
    type: Packaging,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Packaging not found',
  })
  async markAsCompleted(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Packaging> {
    return await this.packagingService.markAsCompleted(id);
  }
}
