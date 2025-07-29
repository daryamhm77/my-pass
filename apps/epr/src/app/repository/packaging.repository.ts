import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { AbstractRepository } from '@etm-pass/common';
import { Packaging } from '../entity/packaging.entity';
import { MaterialType } from '../enums/material-type.enum';
import { PackagingStatistics } from '../interfaces/packaging-statistics.interface';

@Injectable()
export class PackagingRepository extends AbstractRepository<Packaging> {
  protected readonly logger = new Logger(PackagingRepository.name);

  constructor(
    @InjectRepository(Packaging)
    repository: Repository<Packaging>
  ) {
    super(repository);
  }

  async findByCountry(countryId: string): Promise<Packaging[]> {
    const where: FindOptionsWhere<Packaging> = {
      country: { id: countryId },
    };
    return this.findAll(where);
  }

  async findByMaterialType(materialType: MaterialType): Promise<Packaging[]> {
    const where: FindOptionsWhere<Packaging> = { materialType };
    return this.findAll(where);
  }

  async getPackagingStatistics(
    countryId?: string
  ): Promise<PackagingStatistics> {
    const queryBuilder = this.repository.createQueryBuilder('packaging');

    if (countryId) {
      queryBuilder.where('packaging.countryId = :countryId', { countryId });
    }

    const stats = await queryBuilder
      .select([
        'SUM(packaging.totalWeight) as total_weight',
        'AVG(packaging.recycledContent) as avg_recycled_content',
        'COUNT(*) as total_packages',
      ])
      .getRawOne();

    return {
      totalWeight: +(stats.total_weight ?? 0),
      averageRecycledContent: +(stats.avg_recycled_content ?? 0),
      totalPackages: +(stats.total_packages ?? 0),
    };
  }
}
