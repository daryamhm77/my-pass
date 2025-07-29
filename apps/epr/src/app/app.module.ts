import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountryModule } from './country.module';
import { PackagingModule } from './packaging.module';
import { FeeModule } from './fee.module';
import { RecyclingReportModule } from './recycling-report.module';

@Module({
  imports: [CountryModule, PackagingModule, FeeModule, RecyclingReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
