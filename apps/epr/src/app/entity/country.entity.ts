import { BaseEntity } from '@etm-pass/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Packaging } from './packaging.entity';

@Entity('countries')
export class Country extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 2 })
  code: string;

  @Column('decimal', { precision: 5, scale: 2 })
  minimumRecyclingRate: number;

  @OneToMany(() => Packaging, (packaging) => packaging.country)
  packagings: Packaging[];
}
