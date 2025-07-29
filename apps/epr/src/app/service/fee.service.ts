import { Injectable, BadRequestException } from '@nestjs/common';
import { Fee } from '../entity/fee.entity';
import { CreateFeeDto } from '../dto/create-fee.dto';
import { UpdateFeeDto } from '../dto/update-fee.dto';
import { FeeRepository } from '../repository/fee.repository';
import { CountryService } from './country.service';
import { FindOptionsWhere } from 'typeorm';
import { MaterialType } from '../enums/material-type.enum';
import {
  FeeStatistics,
  FeeByMaterialStatistics,
} from '../interfaces/fee-statistics.interface';

@Injectable()
export class FeeService {
  constructor(
    private readonly feeRepository: FeeRepository,
    private readonly countryService: CountryService
  ) {}

  async create(createFeeDto: CreateFeeDto): Promise<Fee> {
    // Validate that the country exists
    const country = await this.countryService.findOne(createFeeDto.countryId);

    // Validate payment date is not in the future
    if (createFeeDto.paymentDate > new Date()) {
      throw new BadRequestException('Payment date cannot be in the future');
    }

    const feeData: Partial<Fee> = {
      ...createFeeDto,
      country,
      isPaid: false, // Default to unpaid
    };

    return await this.feeRepository.create(feeData);
  }

  async findAll(): Promise<Fee[]> {
    return await this.feeRepository.findAll();
  }

  async findOne(id: string): Promise<Fee> {
    const where: FindOptionsWhere<Fee> = { id };
    return await this.feeRepository.findOne(where);
  }

  async update(id: string, updateFeeDto: UpdateFeeDto): Promise<Fee> {
    const fee = await this.findOne(id);

    // If updating country, validate it exists
    if (updateFeeDto.countryId) {
      await this.countryService.findOne(updateFeeDto.countryId);
    }

    // Validate payment date is not in the future
    if (updateFeeDto.paymentDate && updateFeeDto.paymentDate > new Date()) {
      throw new BadRequestException('Payment date cannot be in the future');
    }

    const where: FindOptionsWhere<Fee> = { id };
    return await this.feeRepository.update(where, updateFeeDto);
  }

  async remove(id: string): Promise<void> {
    const where: FindOptionsWhere<Fee> = { id };
    await this.feeRepository.delete(where);
  }

  async findByCountry(countryId: string): Promise<Fee[]> {
    // Validate country exists
    await this.countryService.findOne(countryId);
    return await this.feeRepository.findByCountry(countryId);
  }

  async findByMaterial(material: string): Promise<Fee[]> {
    return await this.feeRepository.findByMaterial(material as MaterialType);
  }

  async findByCountryAndMaterial(
    countryId: string,
    material: MaterialType
  ): Promise<Fee[]> {
    // Validate country exists
    await this.countryService.findOne(countryId);
    return await this.feeRepository.findByCountryAndMaterial(
      countryId,
      material as MaterialType
    );
  }

  async findUnpaidFees(): Promise<Fee[]> {
    return await this.feeRepository.findUnpaidFees();
  }

  async findPaidFees(): Promise<Fee[]> {
    return await this.feeRepository.findPaidFees();
  }

  async findFeesByDateRange(startDate: Date, endDate: Date): Promise<Fee[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    return await this.feeRepository.findFeesByDateRange(startDate, endDate);
  }

  async getFeeStatistics(countryId?: string): Promise<FeeStatistics> {
    // If countryId provided, validate it exists
    if (countryId) {
      await this.countryService.findOne(countryId);
    }
    return await this.feeRepository.getFeeStatistics(countryId);
  }

  async getFeesByMaterialStatistics(): Promise<FeeByMaterialStatistics[]> {
    return await this.feeRepository.getFeesByMaterialStatistics();
  }

  private async updateFeePaymentStatus(
    id: string,
    isPaid: boolean,
    reportUrl?: string
  ): Promise<Fee> {
    const fee = await this.findOne(id);

    if (fee.isPaid === isPaid) {
      throw new BadRequestException(
        `Fee is already marked as ${isPaid ? 'paid' : 'unpaid'}`
      );
    }

    const where: FindOptionsWhere<Fee> = { id };
    const updateData: Partial<Fee> = {
      isPaid,
      reportUrl: isPaid ? reportUrl : undefined,
    };
    return await this.feeRepository.update(where, updateData);
  }

  async markAsPaid(id: string, reportUrl?: string): Promise<Fee> {
    return this.updateFeePaymentStatus(id, true, reportUrl);
  }

  async markAsUnpaid(id: string): Promise<Fee> {
    return this.updateFeePaymentStatus(id, false);
  }

  async calculateTotalAmountForCountry(countryId: string): Promise<{
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
  }> {
    const fees = await this.findByCountry(countryId);

    const totalAmount = fees.reduce((sum, fee) => sum + fee.amountToPay, 0);
    const paidAmount = fees
      .filter((fee) => fee.isPaid)
      .reduce((sum, fee) => sum + fee.amountToPay, 0);
    const unpaidAmount = totalAmount - paidAmount;

    return {
      totalAmount,
      paidAmount,
      unpaidAmount,
    };
  }
}
