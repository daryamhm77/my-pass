import { DatabaseModule } from '@etm-pass/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Notification } from './entity/notification.entity';
import { NotificationsService } from './service/notifications.service';
import {
  SendEmailHandler,
  SendInAppHandler,
  SendRealTimeHandler,
} from './events/handlers';
import { NotificationStrategyFactory } from './strategy/notification-strategy.factory';
import { EmailStrategy } from './strategy/email.strategy';
import { InAppStrategy } from './strategy/inapp.strategy';
import { RealTimeStrategy } from './strategy/realtime.strategy';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { NotificationsController } from './controller/notifications.controller';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Notification])],
  providers: [
    NotificationsService,
    SendEmailHandler,
    SendInAppHandler,
    SendRealTimeHandler,
    NotificationStrategyFactory,
    EmailStrategy,
    InAppStrategy,
    RealTimeStrategy,
    NotificationsGateway,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
