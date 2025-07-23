import { IsNumber, IsOptional } from 'class-validator';

export class RefundPaymentDto {
  @IsNumber()
  @IsOptional()
  amount?: number;
}
