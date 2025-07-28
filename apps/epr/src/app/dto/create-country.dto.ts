import { IsString, IsNumber, Length, Min, Max } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(2, 2)
  code: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  minimumRecyclingRate: number;
}
