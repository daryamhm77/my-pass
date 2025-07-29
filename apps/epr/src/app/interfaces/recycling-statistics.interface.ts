import { ApiProperty } from '@nestjs/swagger';

export class RecyclingStatistics {
  @ApiProperty({ description: 'Total number of recycling reports' })
  totalReports: number;

  @ApiProperty({ description: 'Average recycling rate across all reports' })
  averageRecyclingRate: number;

  @ApiProperty({ description: 'Highest recycling rate reported' })
  maxRecyclingRate: number;

  @ApiProperty({ description: 'Lowest recycling rate reported' })
  minRecyclingRate: number;

  @ApiProperty({ description: 'Total weight recycled across all reports' })
  totalWeight: number;

  @ApiProperty({ description: 'Number of reports that met legal target' })
  legalTargetMetCount: number;

  @ApiProperty({ description: 'Percentage of reports that met legal target' })
  legalTargetMetPercentage: number;
}
