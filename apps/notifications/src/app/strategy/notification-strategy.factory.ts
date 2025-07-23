import { Injectable } from '@nestjs/common';
import { EmailStrategy } from './email.strategy';
import { InAppStrategy } from './inapp.strategy';
import { RealTimeStrategy } from './realtime.strategy';
import { NotificationStrategy } from './notification.strategy';
import { NotificationChannel } from '../enums/ notification-channel.enum';

@Injectable()
export class NotificationStrategyFactory {
  constructor(
    private readonly emailStrategy: EmailStrategy,
    private readonly inAppStrategy: InAppStrategy,
    private readonly realTimeStrategy: RealTimeStrategy
  ) {}

  getStrategy(channel: NotificationChannel): NotificationStrategy {
    switch (channel) {
      case NotificationChannel.EMAIL:
        return this.emailStrategy;
      case NotificationChannel.IN_APP:
        return this.inAppStrategy;
      case NotificationChannel.REALTIME:
        return this.realTimeStrategy;
      default:
        throw new Error(`Unsupported notification channel: ${channel}`);
    }
  }
}
