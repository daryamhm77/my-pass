import { BaseEntity } from '@etm-pass/common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MaterialType } from '../enums/material-type.enum';
import { PackagingLevel } from '../enums/packaging-level.enum';
import { RecyclabilityClass } from '../enums/recyclability-class.enum';
import { Country } from './country.entity';

@Entity('packagings')
export class Packaging extends BaseEntity {
  @Column({ type: 'enum', enum: MaterialType })
  materialType: MaterialType;

  @Column({ type: 'enum', enum: PackagingLevel })
  packagingLevel: PackagingLevel;

  @Column('decimal', { precision: 10, scale: 2 })
  weightPerUnit: number;

  @Column('integer')
  unitsSold: number;

  @Column('decimal', { precision: 5, scale: 2 })
  recycledContent: number;

  @Column({ type: 'enum', enum: RecyclabilityClass })
  recyclabilityClass: RecyclabilityClass;

  @Column('decimal', { precision: 10, scale: 2 })
  totalWeight: number;

  @Column('boolean', { default: false })
  isCompleted: boolean;

  @ManyToOne(() => Country)
  country: Country;

  @Column('date')
  reportingPeriod: Date;
}
