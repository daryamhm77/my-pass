import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { AbstractRepository } from '@etm-pass/common';
import { Fee } from '../entity/fee.entity';
import { MaterialType } from '../enums/material-type.enum';
import {
  FeeStatistics,
  FeeByMaterialStatistics,
} from '../interfaces/fee-statistics.interface';

@Injectable()
export class FeeRepository extends AbstractRepository<Fee> {
  protected readonly logger = new Logger(FeeRepository.name);

  constructor(
    @InjectRepository(Fee)
    repository: Repository<Fee>
  ) {
    super(repository);
  }

  async findByCountry(countryId: string): Promise<Fee[]> {
    const where: FindOptionsWhere<Fee> = {
      country: { id: countryId },
    };
    return this.findAll(where);
  }

  async findByMaterial(material: MaterialType): Promise<Fee[]> {
    const where: FindOptionsWhere<Fee> = { material };
    return this.findAll(where);
  }

  async findByCountryAndMaterial(
    countryId: string,
    material: MaterialType
  ): Promise<Fee[]> {
    const where: FindOptionsWhere<Fee> = {
      country: { id: countryId },
      material,
    };
    return this.findAll(where);
  }

  async findUnpaidFees(): Promise<Fee[]> {
    const where: FindOptionsWhere<Fee> = { isPaid: false };
    return this.findAll(where);
  }

  async findPaidFees(): Promise<Fee[]> {
    const where: FindOptionsWhere<Fee> = { isPaid: true };
    return this.findAll(where);
  }

  async findFeesByDateRange(startDate: Date, endDate: Date): Promise<Fee[]> {
    return this.repository.find({
      where: {
        paymentDate: Between(startDate, endDate),
      },
      relations: ['country'],
      order: {
        paymentDate: 'DESC',
      },
    });
  }

  async getFeeStatistics(countryId?: string): Promise<FeeStatistics> {
    const queryBuilder = this.repository
      .createQueryBuilder('fee')
      .select([
        'COUNT(*) as total_fees',
        'SUM(fee.amountToPay) as total_amount',
        'AVG(fee.amountToPay) as avg_amount',
        'MAX(fee.amountToPay) as max_amount',
        'MIN(fee.amountToPay) as min_amount',
        'AVG(fee.tariffPerKg) as avg_tariff',
        'COUNT(CASE WHEN fee.isPaid = true THEN 1 END) as paid_fees',
        'COUNT(CASE WHEN fee.isPaid = false THEN 1 END) as unpaid_fees',
      ]);

    if (countryId) {
      queryBuilder.where('fee.countryId = :countryId', { countryId });
    }

    const stats = await queryBuilder.getRawOne();

    return {
      totalFees: parseInt(stats.total_fees) || 0,
      totalAmount: parseFloat(stats.total_amount) || 0,
      averageAmount: parseFloat(stats.avg_amount) || 0,
      maxAmount: parseFloat(stats.max_amount) || 0,
      minAmount: parseFloat(stats.min_amount) || 0,
      averageTariff: parseFloat(stats.avg_tariff) || 0,
      paidFees: parseInt(stats.paid_fees) || 0,
      unpaidFees: parseInt(stats.unpaid_fees) || 0,
    };
  }

  async getFeesByMaterialStatistics(): Promise<FeeByMaterialStatistics[]> {
    return this.repository
      .createQueryBuilder('fee')
      .select([
        'fee.material as material',
        'COUNT(*) as total_fees',
        'SUM(fee.amountToPay) as total_amount',
        'AVG(fee.amountToPay) as avg_amount',
      ])
      .groupBy('fee.material')
      .getRawMany()
      .then((results) =>
        results.map((result) => ({
          material: result.material,
          totalFees: parseInt(result.total_fees) || 0,
          totalAmount: parseFloat(result.total_amount) || 0,
          averageAmount: parseFloat(result.avg_amount) || 0,
        }))
      );
  }
}
