import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Between,
  MoreThanOrEqual,
} from 'typeorm';
import { AbstractRepository } from '@etm-pass/common';
import { RecyclingReport } from '../entity/recycling-report.entity';
import { RecyclingStatistics } from '../interfaces/recycling-statistics.interface';

@Injectable()
export class RecyclingReportRepository extends AbstractRepository<RecyclingReport> {
  protected readonly logger = new Logger(RecyclingReportRepository.name);

  constructor(
    @InjectRepository(RecyclingReport)
    repository: Repository<RecyclingReport>
  ) {
    super(repository);
  }

  async findByCountryId(countryId: string): Promise<RecyclingReport[]> {
    return await this.repository.find({
      where: { country: { id: countryId } },
      relations: ['country'],
      order: { reportingDate: 'DESC' },
    });
  }

  async findByRecyclingRate(
    minRate: number,
    maxRate?: number
  ): Promise<RecyclingReport[]> {
    const where: FindOptionsWhere<RecyclingReport> = {};

    if (maxRate) {
      where.recyclingRate = Between(minRate, maxRate);
    } else {
      where.recyclingRate = MoreThanOrEqual(minRate);
    }

    return await this.repository.find({
      where,
      relations: ['country'],
      order: { recyclingRate: 'DESC' },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<RecyclingReport[]> {
    return await this.repository.find({
      where: {
        reportingDate: Between(startDate, endDate),
      },
      relations: ['country'],
      order: { reportingDate: 'DESC' },
    });
  }

  async findByLegalTargetStatus(
    isLegalTargetMet: boolean
  ): Promise<RecyclingReport[]> {
    return await this.repository.find({
      where: { isLegalTargetMet },
      relations: ['country'],
      order: { reportingDate: 'DESC' },
    });
  }

  async getRecyclingStatistics(): Promise<RecyclingStatistics> {
    const queryBuilder = this.repository
      .createQueryBuilder('recycling_report')
      .select([
        'COUNT(*) as total_reports',
        'AVG(recycling_report.recyclingRate) as avg_recycling_rate',
        'MAX(recycling_report.recyclingRate) as max_recycling_rate',
        'MIN(recycling_report.recyclingRate) as min_recycling_rate',
        'SUM(recycling_report.weightPerCountry) as total_weight',
        'SUM(CASE WHEN recycling_report.isLegalTargetMet = true THEN 1 ELSE 0 END) as legal_target_met_count',
      ]);

    const stats = await queryBuilder.getRawOne();

    const totalReports = parseInt(stats.total_reports) || 0;
    const legalTargetMetCount = parseInt(stats.legal_target_met_count) || 0;

    return {
      totalReports,
      averageRecyclingRate: parseFloat(stats.avg_recycling_rate) || 0,
      maxRecyclingRate: parseFloat(stats.max_recycling_rate) || 0,
      minRecyclingRate: parseFloat(stats.min_recycling_rate) || 0,
      totalWeight: parseFloat(stats.total_weight) || 0,
      legalTargetMetCount,
      legalTargetMetPercentage:
        totalReports > 0 ? (legalTargetMetCount / totalReports) * 100 : 0,
    };
  }

  async findAllWithRelations(): Promise<RecyclingReport[]> {
    return await this.repository.find({
      relations: ['country'],
      order: { reportingDate: 'DESC' },
    });
  }
}
