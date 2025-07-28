import {
  IsString,
  IsNumber,
  IsDate,
  Min,
  Max,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecyclingReportDto {
  @IsUUID()
  countryId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  recyclingRate: number;

  @IsDate()
  @Type(() => Date)
  reportingDate: Date;

  @IsDate()
  @Type(() => Date)
  lastRecyclingDate: Date;

  @IsString()
  @IsOptional()
  recyclingCompany?: string;

  @IsNumber()
  @Min(0)
  weightPerUnit: number;

  @IsNumber()
  @Min(0)
  weightPerCountry: number;

  @IsString()
  @IsOptional()
  explanationFile?: string;

  @IsBoolean()
  isLegalTargetMet: boolean;
}
