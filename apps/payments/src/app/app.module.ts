import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment.module';
import { DatabaseModule } from '@etm-pass/database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PaymentModule,
  ],
})
export class AppModule {}
