import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from './contact.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ReservationModule],
})
export class AppModule {}
