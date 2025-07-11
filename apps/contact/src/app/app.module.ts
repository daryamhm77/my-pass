import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from '../contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ بسیار مهم
    ReservationModule,
  ],
})
export class AppModule {}
