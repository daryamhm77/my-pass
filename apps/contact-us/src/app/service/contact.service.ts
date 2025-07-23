import { Injectable } from '@nestjs/common';
import { CreateContactMessageDto } from '../dto/create-contact.dto';
import { ContactMessage } from '../entity/contact.entity';
import { ContactRepository } from '../repository/contatct.repository';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  ضض;

  async getContactById(id: string): Promise<ContactMessage> {
    return this.contactRepository.findOne({ id });
  }

  async updateContact(
    id: string,
    updates: Partial<CreateContactMessageDto>
  ): Promise<ContactMessage> {
    return this.contactRepository.update({ id }, updates);
  }

  async deleteContact(id: string): Promise<void> {
    return this.contactRepository.delete({ id });
  }
}
