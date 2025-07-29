import { BaseEntity } from '@etm-pass/common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MaterialType } from '../enums/material-type.enum';
import { Country } from './country.entity';

@Entity('fees')
export class Fee extends BaseEntity {
  @ManyToOne(() => Country, (country) => country.fees, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @Column({ type: 'enum', enum: MaterialType })
  material: MaterialType;

  @Column('decimal', { precision: 10, scale: 2 })
  tariffPerKg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amountToPay: number;

  @Column('date')
  paymentDate: Date;

  @Column('boolean', { default: false })
  isPaid: boolean;

  @Column('text', { nullable: true })
  reportUrl: string;
}
