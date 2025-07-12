import { DatabaseModule } from '@etm-pass/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContactMessage } from './entity/contact.entity';
import { ContactRepository } from './repository/contatct.repository';
import { ContactController } from './controller/conatct.controller';
import { ContactService } from './service/contact.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ContactMessage])],
  providers: [ContactRepository, ContactService],
  controllers: [ContactController],
  exports: [ContactRepository],
})
export class ReservationModule {}
