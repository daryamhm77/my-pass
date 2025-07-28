import { IsEnum, IsNumber, IsDate, Min, IsUUID } from 'class-validator';
import { MaterialType } from '../enums/material-type.enum';
import { PackagingLevel } from '../enums/packaging-level.enum';
import { RecyclabilityClass } from '../enums/recyclability-class.enum';
import { Type } from 'class-transformer';

export class CreatePackagingDto {
  @IsEnum(MaterialType)
  materialType: MaterialType;

  @IsEnum(PackagingLevel)
  packagingLevel: PackagingLevel;

  @IsNumber()
  @Min(0)
  weightPerUnit: number;

  @IsNumber()
  @Min(1)
  unitsSold: number;

  @IsNumber()
  @Min(0)
  recycledContent: number;

  @IsEnum(RecyclabilityClass)
  recyclabilityClass: RecyclabilityClass;

  @IsUUID()
  countryId: string;

  @IsDate()
  @Type(() => Date)
  reportingPeriod: Date;
}
