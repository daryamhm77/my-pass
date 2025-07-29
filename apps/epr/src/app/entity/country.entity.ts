import { BaseEntity } from '@etm-pass/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Packaging } from './packaging.entity';
import { RecyclingReport } from './recycling-report.entity';
import { Fee } from './fee.entity';

@Entity('countries')
export class Country extends BaseEntity {
  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 2, unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  minimumRecyclingRate: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  lastReportDate: Date;

  @OneToMany(() => Packaging, (packaging) => packaging.country, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  packagings: Packaging[];

  @OneToMany(() => Fee, (fee) => fee.country, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  fees: Fee[];

  @OneToMany(
    () => RecyclingReport,
    (recyclingReport) => recyclingReport.country
  )
  recyclingReports: RecyclingReport[];
}
