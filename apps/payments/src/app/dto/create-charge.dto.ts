import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CardDto } from './card.dto';
import { Currency } from '../enums/currency.enum';

export class CreateChargeDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @IsNumber()
  amount: number;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
