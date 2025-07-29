import { Injectable, NotFoundException } from '@nestjs/common';
import { PackagingRepository } from '../repository/packaging.repository';
import { Packaging } from '../entity/packaging.entity';
import { CreatePackagingDto } from '../dto/create-packaging.dto';
import { FindOptionsWhere } from 'typeorm';
import { MaterialType } from '../enums/material-type.enum';
import { PackagingStatistics } from '../interfaces/packaging-statistics.interface';
import { UpdatePackagingDto } from '../dto/update-packaging.dto';

@Injectable()
export class PackagingService {
  constructor(private readonly packagingRepository: PackagingRepository) {}

  async create(createPackagingDto: CreatePackagingDto): Promise<Packaging> {
    const totalWeight =
      createPackagingDto.weightPerUnit * createPackagingDto.unitsSold;

    const packagingData: Partial<Packaging> = {
      ...createPackagingDto,
      totalWeight,
    };
    return await this.packagingRepository.create(packagingData);
  }

  async findAll(): Promise<Packaging[]> {
    return await this.packagingRepository.findAll();
  }

  async findOne(id: string): Promise<Packaging> {
    const where: FindOptionsWhere<Packaging> = { id };
    return await this.packagingRepository.findOne(where);
  }

  async update(
    id: string,
    updatePackagingDto: UpdatePackagingDto
  ): Promise<Packaging> {
    const packaging = await this.findOne(id);

    let totalWeight = packaging.totalWeight;
    if (updatePackagingDto.weightPerUnit || updatePackagingDto.unitsSold) {
      const weightPerUnit =
        updatePackagingDto.weightPerUnit || packaging.weightPerUnit;
      const unitsSold = updatePackagingDto.unitsSold || packaging.unitsSold;
      totalWeight = weightPerUnit * unitsSold;
    }

    const where: FindOptionsWhere<Packaging> = { id };
    const updateData: Partial<Packaging> = {
      ...updatePackagingDto,
      totalWeight,
    };
    return await this.packagingRepository.update(where, updateData);
  }

  async remove(id: string): Promise<void> {
    const where: FindOptionsWhere<Packaging> = { id };
    await this.packagingRepository.delete(where);
  }

  async findByCountry(countryId: string): Promise<Packaging[]> {
    return await this.packagingRepository.findByCountry(countryId);
  }

  async findByMaterialType(materialType: MaterialType): Promise<Packaging[]> {
    return await this.packagingRepository.findByMaterialType(
      materialType as MaterialType
    );
  }

  async getPackagingStatistics(
    countryId?: string
  ): Promise<PackagingStatistics> {
    return await this.packagingRepository.getPackagingStatistics(countryId);
  }

  async markAsCompleted(id: string): Promise<Packaging> {
    const packaging = await this.packagingRepository.findOne({ id });
    if (!packaging) throw new NotFoundException();

    const where: FindOptionsWhere<Packaging> = { id };
    const updateData: Partial<Packaging> = { isCompleted: true };
    return await this.packagingRepository.update(where, updateData);
  }
}
