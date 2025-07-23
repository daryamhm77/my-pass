import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { NotificationChannel } from '../enums/ notification-channel.enum';
import { NotificationType } from '../enums/ notification-type.enum';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsEnum(NotificationChannel)
  @IsOptional()
  channel: NotificationChannel = NotificationChannel.IN_APP;

  @IsEnum(NotificationType)
  @IsOptional()
  type: NotificationType = NotificationType.INFO;

  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  subject?: string;

  @IsOptional()
  @IsEmail()
  to?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  scheduledAt?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  expiresAt?: Date;
}
