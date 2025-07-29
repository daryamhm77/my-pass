import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeController } from './controller/fee.controller';
import { FeeService } from './service/fee.service';
import { FeeRepository } from './repository/fee.repository';
import { Fee } from './entity/fee.entity';
import { CountryModule } from './country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fee]),
    CountryModule, // Import CountryModule to use CountryService
  ],
  controllers: [FeeController],
  providers: [FeeService, FeeRepository],
  exports: [FeeService, FeeRepository],
})
export class FeeModule {}
