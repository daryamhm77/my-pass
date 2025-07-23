import { BaseEntity } from '@etm-pass/common';
import { Column, Entity } from 'typeorm';
import { PaymentStatus } from '../enums/payment-status.enum';
import { Currency } from '../enums/currency.enum';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column()
  stripePaymentIntentId: string;

  @Column()
  stripePaymentMethodId: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: Currency, default: Currency.EUR })
  currency: Currency;

  @Column({ type: 'varchar', length: 255, nullable: true })
  invoiceId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userId?: string;
}
