import { Entity, Column, Index, DeleteDateColumn } from 'typeorm';
import { NotificationChannel } from '../enums/ notification-channel.enum';
import { NotificationType } from '../enums/ notification-type.enum';
import { BaseEntity } from '@etm-pass/common';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Index()
  @Column()
  userId: number;

  @Column({ default: NotificationType.INFO })
  type: NotificationType;

  @Column({ default: NotificationChannel.IN_APP })
  channel: NotificationChannel;

  @Column({ nullable: true })
  title?: string;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ nullable: true })
  to?: string;

  @Index()
  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
