import { DatabaseModule } from '@etm-pass/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContactMessage } from './entity/contact.entity';
import { ContactRepository } from './contatct.repository';
import { ContactService } from './contact.service';
import { ContactController } from './conatct.controller';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ContactMessage])],
  providers: [ContactRepository, ContactService],
  controllers: [ContactController],
  exports: [ContactRepository],
})
export class ReservationModule {}
