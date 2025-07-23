import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationsService } from '../service/notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Controller()
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('send_notification')
  async handleNotification(
    @Payload() data: CreateNotificationDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.notificationsService.send(data);
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error('Failed to process notification', error);

      channel.nack(originalMsg, false, false);
    }
  }
}
