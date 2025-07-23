import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { CreateChargeDto } from '../dto/create-charge.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: CreateChargeDto) {
    return this.paymentService.createCharge(data);
  }
}
