import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationStrategy } from './notification.strategy';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../entity/notification.entity';
import { NotificationChannel } from '../enums/ notification-channel.enum';

@Injectable()
export class InAppStrategy implements NotificationStrategy {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async send(notification: CreateNotificationDto): Promise<void> {
    if (notification.channel !== NotificationChannel.IN_APP) {
      throw new BadRequestException('Invalid channel for in-app strategy');
    }

    if (!notification.message) {
      throw new BadRequestException(
        'Message is required for in-app notifications'
      );
    }

    try {
      const now = new Date();
      const newNotification = this.notificationRepository.create({
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        channel: notification.channel,
        scheduledAt: notification.scheduledAt,
        expiresAt: notification.expiresAt,
        isRead: false,
      });

      // Don't save if it's a scheduled notification for the future
      if (notification.scheduledAt && notification.scheduledAt > now) {
        return;
      }

      await this.notificationRepository.save(newNotification);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to save in-app notification: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
