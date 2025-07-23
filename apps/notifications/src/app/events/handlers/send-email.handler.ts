import { Injectable } from '@nestjs/common';
import { NotificationStrategyFactory } from '../../strategy/notification-strategy.factory';
import { NotificationChannel } from '../../enums/ notification-channel.enum';
import { CreateNotificationDto } from '../../dto/create-notification.dto';

@Injectable()
export class SendEmailHandler {
  constructor(
    private readonly notificationStrategyFactory: NotificationStrategyFactory
  ) {}

  async execute(data: CreateNotificationDto) {
    try {
      const emailStrategy = this.notificationStrategyFactory.getStrategy(
        NotificationChannel.EMAIL
      );
      await emailStrategy.send(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to send email notification: ${error.message}`);
      } else {
        throw new Error('Failed to send email notification: Unknown error');
      }
    }
  }
}
