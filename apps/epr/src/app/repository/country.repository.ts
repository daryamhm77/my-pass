import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { AbstractRepository } from '@etm-pass/common';
import { Country } from '../entity/country.entity';
import { CountryStatistics } from '../interfaces/country-statistics.interface';

@Injectable()
export class CountryRepository extends AbstractRepository<Country> {
  protected readonly logger = new Logger(CountryRepository.name);

  constructor(
    @InjectRepository(Country)
    repository: Repository<Country>
  ) {
    super(repository);
  }

  async findByCode(code: string): Promise<Country | null> {
    const where: FindOptionsWhere<Country> = { code };
    try {
      return await this.findOne(where);
    } catch {
      return null;
    }
  }

  async findByName(name: string): Promise<Country | null> {
    const where: FindOptionsWhere<Country> = { name };
    try {
      return await this.findOne(where);
    } catch {
      return null;
    }
  }

  async findCountriesWithHighRecyclingRate(
    minRate: number
  ): Promise<Country[]> {
    return this.repository
      .createQueryBuilder('country')
      .where('country.minimumRecyclingRate >= :minRate', { minRate })
      .orderBy('country.minimumRecyclingRate', 'DESC')
      .getMany();
  }

  async getCountryStatistics(): Promise<CountryStatistics> {
    const queryBuilder = this.repository.createQueryBuilder('country');

    const stats = await queryBuilder
      .select([
        'COUNT(country.id) as total_countries',
        'AVG(country.minimumRecyclingRate) as avg_recycling_rate',
        'MAX(country.minimumRecyclingRate) as max_recycling_rate',
        'MIN(country.minimumRecyclingRate) as min_recycling_rate',
      ])
      .getRawOne();

    return {
      totalCountries: parseInt(stats.total_countries) || 0,
      averageRecyclingRate: parseFloat(stats.avg_recycling_rate) || 0,
      maxRecyclingRate: parseFloat(stats.max_recycling_rate) || 0,
      minRecyclingRate: parseFloat(stats.min_recycling_rate) || 0,
    };
  }

  async findCountriesWithPackagings(): Promise<Country[]> {
    return this.repository
      .createQueryBuilder('country')
      .innerJoin('country.packagings', 'packaging')
      .getMany();
  }
}
