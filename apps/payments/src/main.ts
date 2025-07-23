import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PaymentModule } from './app/payment.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>('HOST', '0.0.0.0'),
      port: configService.get<number>('PORT', 3003),
    },
  });
  await app.startAllMicroservices();
  const host = configService.get<string>('HOST', '0.0.0.0');
  const port = configService.get<number>('PORT', 3003);
  await app.listen(port, host);
  console.log(`🚀 Payments Microservice is running on TCP ${host}:${port}`);
}

bootstrap();
