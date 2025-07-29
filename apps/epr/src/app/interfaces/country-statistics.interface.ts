import { ApiProperty } from '@nestjs/swagger';

export class CountryStatistics {
  @ApiProperty()
  totalCountries: number;
  @ApiProperty()
  averageRecyclingRate: number;
  @ApiProperty()
  maxRecyclingRate: number;
  @ApiProperty()
  minRecyclingRate: number;
}
