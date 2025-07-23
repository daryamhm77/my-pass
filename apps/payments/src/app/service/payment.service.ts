import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentEntity } from '../entity/payment.entity';
import { CreateChargeDto } from '../dto/create-charge.dto';
import { Currency } from '../enums/currency.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { RefundPaymentDto } from '../dto/refund-payment.dto';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly configService: ConfigService
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('Stripe secret key not configured');
    this.stripe = new Stripe(stripeKey, { apiVersion: '2025-06-30.basil' });
  }

  async createCharge(dto: CreateChargeDto) {
    try {
      const { card, amount, email, currency = Currency.EUR } = dto;
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card,
      });

      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: paymentMethod.id,
        amount: Math.round(amount * 100),
        confirm: true,
        payment_method_types: ['card'],
        currency: currency || 'usd',
        receipt_email: email,
      });

      const payment = this.paymentRepository.create({
        amount: amount,
        email: email,
        stripePaymentIntentId: paymentIntent.id,
        stripePaymentMethodId: paymentMethod.id,
        status: paymentIntent.status as PaymentStatus,
        currency: currency || 'usd',
      });
      await this.paymentRepository.save(payment);
      return payment;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Payment failed: ' + error.message);
      }
      throw new Error('Payment failed: Unknown error');
    }
  }

  async findPaymentById(id: number) {
    return this.paymentRepository.findOne({ where: { id: String(id) } });
  }

  async refund(id: number, dto: RefundPaymentDto) {
    const payment = await this.paymentRepository.findOneByOrFail({
      id: String(id),
    });

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: dto.amount ? Math.round(dto.amount * 100) : undefined,
      });

      return {
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Refund failed: ' + error.message);
      }
      throw new Error('Refund failed: Unknown error');
    }
  }

  async getPaymentStatusByIntentId(intentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: intentId },
    });
    if (!payment) throw new Error('Payment not found');
    return { status: payment.status };
  }
}
