import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateContactMessageDto } from '../dto/create-contact.dto';
import { UpdateReservationDto } from '../dto/update-contact.dto';
import { ContactMessage } from '../entity/contact.entity';
import { ContactService } from '../service/contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() dto: CreateContactMessageDto): Promise<ContactMessage> {
    return this.contactService.createContact(dto);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<ContactMessage> {
    return this.contactService.getContactById(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updates: UpdateReservationDto
  ): Promise<ContactMessage> {
    return this.contactService.updateContact(id, updates);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.contactService.deleteContact(id);
  }
}
