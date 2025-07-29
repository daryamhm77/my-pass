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
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecyclingReportDto {
  @ApiProperty({ description: 'ID of the country this report belongs to' })
  @IsUUID()
  countryId: string;

  @ApiProperty({
    description: 'Recycling rate percentage',
    minimum: 0,
    maximum: 100,
    example: 75.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  recyclingRate: number;

  @ApiProperty({
    description: 'Date when the report was submitted',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  reportingDate: Date;

  @ApiProperty({
    description: 'Date of the last recycling activity',
    type: Date,
  })
  @IsDate()
  lastRecyclingDate: Date;

  @ApiProperty({
    description: 'Name of the company responsible for recycling',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  recyclingCompany?: string;

  @ApiProperty({
    description: 'Weight per unit in kilograms',
    minimum: 0,
    example: 0.5,
  })
  @IsNumber()
  @Min(0)
  weightPerUnit: number;

  @ApiProperty({
    description: 'Total weight for the country in kilograms',
    minimum: 0,
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  weightPerCountry: number;

  @ApiProperty({
    description: 'URL or path to the explanation file',
    required: false,
  })
  @IsString()
  @IsOptional()
  explanationFile?: string;

  @ApiProperty({
    description: 'Whether the legal recycling target was met',
    default: false,
  })
  @IsBoolean()
  isLegalTargetMet: boolean;
}
