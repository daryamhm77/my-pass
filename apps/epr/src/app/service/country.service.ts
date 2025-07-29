import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Country } from '../entity/country.entity';
import { CreateCountryDto } from '../dto/create-country.dto';
import { UpdateCountryDto } from '../dto/update-country.dto';
import { CountryRepository } from '../repository/country.repository';
import { FindOptionsWhere } from 'typeorm';
import { CountryStatistics } from '../interfaces/country-statistics.interface';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    // Check if country with same code already exists
    const existingCountry = await this.countryRepository.findByCode(
      createCountryDto.code
    );
    if (existingCountry) {
      throw new ConflictException(
        `Country with code "${createCountryDto.code}" already exists`
      );
    }

    // Check if country with same name already exists
    const existingName = await this.countryRepository.findByName(
      createCountryDto.name
    );
    if (existingName) {
      throw new ConflictException(
        `Country with name "${createCountryDto.name}" already exists`
      );
    }

    return await this.countryRepository.create(createCountryDto);
  }

  async findAll(): Promise<Country[]> {
    return await this.countryRepository.findAll();
  }

  async findOne(id: string): Promise<Country> {
    const where: FindOptionsWhere<Country> = { id };
    return await this.countryRepository.findOne(where);
  }

  async findByCode(code: string): Promise<Country> {
    const country = await this.countryRepository.findByCode(code);
    if (!country) {
      throw new NotFoundException(`Country with code "${code}" not found`);
    }
    return country;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto
  ): Promise<Country> {
    const country = await this.findOne(id);

    // Check if updating code would create a duplicate
    if (updateCountryDto.code && updateCountryDto.code !== country.code) {
      const existingCode = await this.countryRepository.findByCode(
        updateCountryDto.code
      );
      if (existingCode) {
        throw new ConflictException(
          `Country with code "${updateCountryDto.code}" already exists`
        );
      }
    }

    // Check if updating name would create a duplicate
    if (updateCountryDto.name && updateCountryDto.name !== country.name) {
      const existingName = await this.countryRepository.findByName(
        updateCountryDto.name
      );
      if (existingName) {
        throw new ConflictException(
          `Country with name "${updateCountryDto.name}" already exists`
        );
      }
    }

    const where: FindOptionsWhere<Country> = { id };
    return await this.countryRepository.update(where, updateCountryDto);
  }

  async remove(id: string): Promise<void> {
    const where: FindOptionsWhere<Country> = { id };
    await this.countryRepository.delete(where);
  }

  async findCountriesWithHighRecyclingRate(
    minRate: number
  ): Promise<Country[]> {
    return await this.countryRepository.findCountriesWithHighRecyclingRate(
      minRate
    );
  }

  async getCountryStatistics(): Promise<CountryStatistics> {
    return await this.countryRepository.getCountryStatistics();
  }

  async findCountriesWithPackagings(): Promise<Country[]> {
    return await this.countryRepository.findCountriesWithPackagings();
  }

  async validateCountryExists(id: string): Promise<boolean> {
    try {
      await this.findOne(id);
      return true;
    } catch {
      return false;
    }
  }
}
