import { Injectable } from '@nestjs/common';
import { NotificationStrategyFactory } from '../../strategy/notification-strategy.factory';
import { NotificationChannel } from '../../enums/ notification-channel.enum';
import { CreateNotificationDto } from '../../dto/create-notification.dto';

@Injectable()
export class SendInAppHandler {
  constructor(
    private readonly notificationStrategyFactory: NotificationStrategyFactory
  ) {}

  async execute(data: CreateNotificationDto) {
    try {
      const inAppStrategy = this.notificationStrategyFactory.getStrategy(
        NotificationChannel.IN_APP
      );
      await inAppStrategy.send(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to send in-app notification: ${error.message}`);
      } else {
        throw new Error('Failed to send in-app notification: Unknown error');
      }
    }
  }
}
