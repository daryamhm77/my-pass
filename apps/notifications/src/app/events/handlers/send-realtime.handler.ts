import { Injectable } from '@nestjs/common';
import { NotificationStrategyFactory } from '../../strategy/notification-strategy.factory';
import { NotificationChannel } from '../../enums/ notification-channel.enum';
import { CreateNotificationDto } from '../../dto/create-notification.dto';

@Injectable()
export class SendRealTimeHandler {
  constructor(
    private readonly notificationStrategyFactory: NotificationStrategyFactory
  ) {}

  async execute(data: CreateNotificationDto) {
    try {
      const realTimeStrategy = this.notificationStrategyFactory.getStrategy(
        NotificationChannel.REALTIME
      );
      await realTimeStrategy.send(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to send real-time notification: ${error.message}`
        );
      } else {
        throw new Error('Failed to send real-time notification: Unknown error');
      }
    }
  }
}
