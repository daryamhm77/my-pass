import { AbstractRepository } from '@etm-pass/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../entity/contact.entity';

@Injectable()
export class ContactRepository extends AbstractRepository<ContactMessage> {
  protected readonly logger = new Logger(ContactRepository.name);
  constructor(
    @InjectRepository(ContactMessage)
    contactRepository: Repository<ContactMessage>
  ) {
    super(contactRepository);
  }
}
