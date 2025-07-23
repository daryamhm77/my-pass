import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NotificationChannel } from '../enums/ notification-channel.enum';
import { CreateNotificationDto } from '../dto/create-notification.dto';

type NotificationDto = CreateNotificationDto;

@Injectable()
export class NotificationProducer {
  private readonly logger = new Logger(NotificationProducer.name);

  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy
  ) {}

  async sendNotification(notification: NotificationDto): Promise<void> {
    const pattern = this.getPatternByChannel(notification.channel);

    try {
      await lastValueFrom(this.client.emit(pattern, notification));
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to send notification: ${error.message}`,
          error.stack
        );
        throw new Error(`Failed to send notification: ${error.message}`);
      }
      this.logger.error('Failed to send notification: Unknown error');
      throw new Error('Failed to send notification: Unknown error');
    }
  }

  private getPatternByChannel(channel: NotificationChannel): string {
    const patterns = {
      [NotificationChannel.EMAIL]: 'send_email_notification',
      [NotificationChannel.REALTIME]: 'send_realtime_notification',
      [NotificationChannel.IN_APP]: 'send_inapp_notification',
    };

    return patterns[channel] || 'send_notification';
  }
}
