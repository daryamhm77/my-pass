import { ApiProperty } from '@nestjs/swagger';

export class FeeStatistics {
  @ApiProperty()
  totalFees: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  averageAmount: number;

  @ApiProperty()
  maxAmount: number;

  @ApiProperty()
  minAmount: number;

  @ApiProperty()
  averageTariff: number;

  @ApiProperty()
  paidFees: number;

  @ApiProperty()
  unpaidFees: number;
}

export class FeeByMaterialStatistics {
  @ApiProperty()
  material: string;

  @ApiProperty()
  totalFees: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  averageAmount: number;
}
