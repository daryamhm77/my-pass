import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { AbstractRepository } from '@etm-pass/common';
import { Packaging } from '../entity/packaging.entity';
import { MaterialType } from '../enums/material-type.enum';

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

  async getPackagingStatistics(countryId?: string) {
    const queryBuilder = this.repository.createQueryBuilder('packaging');

    if (countryId) {
      queryBuilder.where('packaging.countryId = :countryId', { countryId });
    }

    const stats = await queryBuilder
      .select([
        'SUM(packaging.totalWeight)',
        'total_weight',
        'AVG(packaging.recycledContent)',
        'avg_recycled_content',
        'COUNT(*)',
        'total_packages',
      ])
      .getRawOne();

    return {
      totalWeight: parseFloat(stats.total_weight) || 0,
      averageRecycledContent: parseFloat(stats.avg_recycled_content) || 0,
      totalPackages: parseInt(stats.total_packages) || 0,
    };
  }
}
