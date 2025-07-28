import { BaseEntity } from '@etm-pass/common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Country } from './country.entity';

@Entity('recycling_reports')
export class RecyclingReport extends BaseEntity {
  @ManyToOne(() => Country)
  country: Country;

  @Column('decimal', { precision: 5, scale: 2 })
  recyclingRate: number;

  @Column('date')
  reportingDate: Date;

  @Column('date')
  lastRecyclingDate: Date;

  @Column({ length: 255, nullable: true })
  recyclingCompany: string;

  @Column('decimal', { precision: 10, scale: 2 })
  weightPerUnit: number;

  @Column('decimal', { precision: 10, scale: 2 })
  weightPerCountry: number;

  @Column('text', { nullable: true })
  explanationFile: string;

  @Column('boolean', { default: false })
  isLegalTargetMet: boolean;
}
