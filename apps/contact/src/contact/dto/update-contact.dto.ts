import { PartialType } from '@nestjs/mapped-types';
import { CreateContactMessageDto } from './create-contact.dto';

export class UpdateReservationDto extends PartialType(
  CreateContactMessageDto
) {}
