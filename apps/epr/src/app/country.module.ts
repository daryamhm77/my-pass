import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './controller/country.controller';
import { CountryService } from './service/country.service';
import { CountryRepository } from './repository/country.repository';
import { Country } from './entity/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountryController],
  providers: [CountryService, CountryRepository],
  exports: [CountryService, CountryRepository],
})
export class CountryModule {}
