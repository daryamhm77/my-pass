import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecyclingReport } from './entity/recycling-report.entity';
import { RecyclingReportController } from './controller/recycling-report.controller';
import { RecyclingReportService } from './service/recycling-report.service';
import { RecyclingReportRepository } from './repository/recycling-report.repository';
import { CountryModule } from './country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecyclingReport]),
    CountryModule, // Import CountryModule to access CountryService
  ],
  controllers: [RecyclingReportController],
  providers: [RecyclingReportService, RecyclingReportRepository],
  exports: [RecyclingReportService], // Export service for use in other modules
})
export class RecyclingReportModule {}
