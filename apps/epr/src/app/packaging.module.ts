import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagingController } from './controller/packaging.controller';
import { PackagingService } from './service/packaging.service';
import { PackagingRepository } from './repository/packaging.repository';
import { Packaging } from './entity/packaging.entity';
import { Country } from './entity/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Packaging, Country])],
  controllers: [PackagingController],
  providers: [PackagingService, PackagingRepository],
  exports: [PackagingService],
})
export class PackagingModule {}
