import { DatabaseModule } from '@etm-pass/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PaymentEntity } from './entity/payment.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([PaymentEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class PaymentModule {}
