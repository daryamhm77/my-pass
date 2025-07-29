import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RecyclingReport } from '../entity/recycling-report.entity';
import { CreateRecyclingReportDto } from '../dto/create-recycling-report.dto';
import { UpdateRecyclingReportDto } from '../dto/update-recycling-report.dto';
import { RecyclingReportRepository } from '../repository/recycling-report.repository';
import { CountryService } from './country.service';
import { RecyclingStatistics } from '../interfaces/recycling-statistics.interface';

@Injectable()
export class RecyclingReportService {
  constructor(
    private readonly recyclingReportRepository: RecyclingReportRepository,
    private readonly countryService: CountryService
  ) {}

  async create(
    createRecyclingReportDto: CreateRecyclingReportDto
  ): Promise<RecyclingReport> {
    // Validate country exists
    const country = await this.countryService.findOne(
      createRecyclingReportDto.countryId
    );
    if (!country) {
      throw new NotFoundException(
        `Country with ID "${createRecyclingReportDto.countryId}" not found`
      );
    }

    // Validate dates
    if (
      createRecyclingReportDto.lastRecyclingDate >
      createRecyclingReportDto.reportingDate
    ) {
      throw new BadRequestException(
        'Last recycling date cannot be after reporting date'
      );
    }

    // Validate recycling rate
    if (
      createRecyclingReportDto.recyclingRate < 0 ||
      createRecyclingReportDto.recyclingRate > 100
    ) {
      throw new BadRequestException('Recycling rate must be between 0 and 100');
    }

    const recyclingReport = {
      ...createRecyclingReportDto,
      country,
    };

    return await this.recyclingReportRepository.create(recyclingReport);
  }

  async findAll(): Promise<RecyclingReport[]> {
    return await this.recyclingReportRepository.findAllWithRelations();
  }

  async findOne(id: string): Promise<RecyclingReport> {
    const recyclingReport = await this.recyclingReportRepository.findOne({
      id,
    });
    if (!recyclingReport) {
      throw new NotFoundException(`Recycling report with ID "${id}" not found`);
    }
    return recyclingReport;
  }

  async findByCountryId(countryId: string): Promise<RecyclingReport[]> {
    // Validate country exists
    await this.countryService.findOne(countryId);
    return await this.recyclingReportRepository.findByCountryId(countryId);
  }

  async findByRecyclingRate(
    minRate: number,
    maxRate?: number
  ): Promise<RecyclingReport[]> {
    if (minRate < 0 || minRate > 100) {
      throw new BadRequestException(
        'Minimum recycling rate must be between 0 and 100'
      );
    }
    if (maxRate && (maxRate < 0 || maxRate > 100)) {
      throw new BadRequestException(
        'Maximum recycling rate must be between 0 and 100'
      );
    }
    if (maxRate && minRate > maxRate) {
      throw new BadRequestException(
        'Minimum rate cannot be greater than maximum rate'
      );
    }

    return await this.recyclingReportRepository.findByRecyclingRate(
      minRate,
      maxRate
    );
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<RecyclingReport[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    return await this.recyclingReportRepository.findByDateRange(
      startDate,
      endDate
    );
  }

  async findByLegalTargetStatus(
    isLegalTargetMet: boolean
  ): Promise<RecyclingReport[]> {
    return await this.recyclingReportRepository.findByLegalTargetStatus(
      isLegalTargetMet
    );
  }

  async update(
    id: string,
    updateRecyclingReportDto: UpdateRecyclingReportDto
  ): Promise<RecyclingReport> {
    const existingReport = await this.findOne(id);

    // Validate country if being updated
    if (updateRecyclingReportDto.countryId) {
      const country = await this.countryService.findOne(
        updateRecyclingReportDto.countryId
      );
      if (!country) {
        throw new NotFoundException(
          `Country with ID "${updateRecyclingReportDto.countryId}" not found`
        );
      }
    }

    // Validate dates if being updated
    const reportingDate =
      updateRecyclingReportDto.reportingDate || existingReport.reportingDate;
    const lastRecyclingDate =
      updateRecyclingReportDto.lastRecyclingDate ||
      existingReport.lastRecyclingDate;

    if (lastRecyclingDate > reportingDate) {
      throw new BadRequestException(
        'Last recycling date cannot be after reporting date'
      );
    }

    // Validate recycling rate if being updated
    if (updateRecyclingReportDto.recyclingRate !== undefined) {
      if (
        updateRecyclingReportDto.recyclingRate < 0 ||
        updateRecyclingReportDto.recyclingRate > 100
      ) {
        throw new BadRequestException(
          'Recycling rate must be between 0 and 100'
        );
      }
    }

    return await this.recyclingReportRepository.update(
      { id },
      updateRecyclingReportDto
    );
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.recyclingReportRepository.delete({ id });
  }

  async getRecyclingStatistics(): Promise<RecyclingStatistics> {
    return await this.recyclingReportRepository.getRecyclingStatistics();
  }

  async validateExists(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      return true;
    } catch {
      return false;
    }
  }
}
