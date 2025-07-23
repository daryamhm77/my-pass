import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CardDto {
  @IsCreditCard()
  number: string;

  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  exp_month: number;

  @IsNumber()
  @Min(new Date().getFullYear())
  exp_year: number;
}
