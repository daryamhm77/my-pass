import { IsNumber, IsDate, Min, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MaterialType } from '../enums/material-type.enum';

export class CreateFeeDto {
  @IsUUID()
  countryId: string;

  @IsEnum(MaterialType)
  material: MaterialType;

  @IsNumber()
  @Min(0)
  tariffPerKg: number;

  @IsNumber()
  @Min(0)
  amountToPay: number;

  @IsDate()
  @Type(() => Date)
  paymentDate: Date;
}
