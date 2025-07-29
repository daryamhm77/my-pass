import { BaseEntity } from '@etm-pass/common';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from './country.entity';

@Entity('recycling_reports')
export class RecyclingReport extends BaseEntity {
  @ApiProperty({ type: () => Country })
  @ManyToOne(() => Country, (country) => country.recyclingReports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @ApiProperty({
    description: 'Recycling rate percentage',
    minimum: 0,
    maximum: 100,
  })
  @Column('decimal', { precision: 5, scale: 2 })
  recyclingRate: number;

  @ApiProperty({ description: 'Date when the report was submitted' })
  @Column('date')
  reportingDate: Date;

  @ApiProperty({ description: 'Date of the last recycling activity' })
  @Column('date')
  lastRecyclingDate: Date;

  @ApiProperty({
    description: 'Name of the company responsible for recycling',
    required: false,
  })
  @Column({ length: 255, nullable: true })
  recyclingCompany: string;

  @ApiProperty({
    description: 'Weight per unit in kilograms',
    minimum: 0,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  weightPerUnit: number;

  @ApiProperty({
    description: 'Total weight for the country in kilograms',
    minimum: 0,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  weightPerCountry: number;

  @ApiProperty({
    description: 'URL or path to the explanation file',
    required: false,
  })
  @Column('text', { nullable: true })
  explanationFile: string;

  @ApiProperty({
    description: 'Whether the legal recycling target was met',
    default: false,
  })
  @Column('boolean', { default: false })
  isLegalTargetMet: boolean;
}
