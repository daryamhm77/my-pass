import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@etm-pass/common';

@Entity('contact_messages')
export class ContactMessage extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 200 })
  subject: string;

  @Column({ type: 'text' })
  message: string;
}
