import {
  IsString,
  IsNumber,
  Length,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({ description: 'Country name', minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Country code (ISO 3166-1 alpha-2)',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @Length(2, 2)
  code: string;

  @ApiProperty({
    description: 'Minimum required recycling rate (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  minimumRecyclingRate: number;

  @ApiPropertyOptional({
    description: 'Whether the country is active in the system',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Date of the last recycling report',
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  lastReportDate?: Date;
}
