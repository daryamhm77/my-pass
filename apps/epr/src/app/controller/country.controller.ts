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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CountryService } from '../service/country.service';
import { CreateCountryDto } from '../dto/create-country.dto';
import { UpdateCountryDto } from '../dto/update-country.dto';
import { Country } from '../entity/country.entity';
import { CountryStatistics } from '../interfaces/country-statistics.interface';

@ApiTags('Countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @ApiOperation({ summary: 'Create new country' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created',
    type: Country,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Country with same code or name already exists',
  })
  async create(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
    return await this.countryService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiQuery({
    name: 'minRecyclingRate',
    required: false,
    description: 'Filter countries with minimum recycling rate',
    type: Number,
  })
  @ApiQuery({
    name: 'withPackagings',
    required: false,
    description: 'Filter countries that have packaging data',
    type: Boolean,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved',
    type: [Country],
  })
  async findAll(
    @Query('minRecyclingRate', new ParseFloatPipe({ optional: true }))
    minRecyclingRate?: number,
    @Query('withPackagings') withPackagings?: string
  ): Promise<Country[]> {
    if (minRecyclingRate !== undefined) {
      return await this.countryService.findCountriesWithHighRecyclingRate(
        minRecyclingRate
      );
    }
    if (withPackagings === 'true') {
      return await this.countryService.findCountriesWithPackagings();
    }
    return await this.countryService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get country statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved statistics',
    type: CountryStatistics,
  })
  async getStatistics(): Promise<CountryStatistics> {
    return await this.countryService.getCountryStatistics();
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get country by code' })
  @ApiParam({ name: 'code', description: 'Country code (ISO 3166-1 alpha-2)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved',
    type: Country,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found',
  })
  async findByCode(@Param('code') code: string): Promise<Country> {
    return await this.countryService.findByCode(code.toUpperCase());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved',
    type: Country,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Country> {
    return await this.countryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated',
    type: Country,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Country with same code or name already exists',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCountryDto: UpdateCountryDto
  ): Promise<Country> {
    return await this.countryService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.countryService.remove(id);
  }

  @Get(':id/validate')
  @ApiOperation({ summary: 'Validate if country exists' })
  @ApiParam({ name: 'id', description: 'Country ID' })
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
  async validateCountry(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<{ exists: boolean }> {
    const exists = await this.countryService.validateCountryExists(id);
    return { exists };
  }
}
