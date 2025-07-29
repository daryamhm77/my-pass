import { ApiProperty } from '@nestjs/swagger';

export class PackagingStatistics {
  @ApiProperty()
  totalWeight: number;

  @ApiProperty()
  averageRecycledContent: number;

  @ApiProperty()
  totalPackages: number;
}
