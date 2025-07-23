import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationStrategy } from './notification.strategy';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { NotificationChannel } from '../enums/ notification-channel.enum';
import { Notification } from '../entity/notification.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RealTimeStrategy implements NotificationStrategy {
  private readonly logger = new Logger(RealTimeStrategy.name);
  private readonly pendingNotifications = new Map<
    string,
    { notification: any; retries: number }
  >();
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_INTERVAL = 5000; // 5 seconds

  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {
    // Clean up pending notifications periodically
    setInterval(() => this.cleanupPendingNotifications(), 60000); // Every minute
  }

  async send(notification: CreateNotificationDto): Promise<void> {
    if (notification.channel !== NotificationChannel.REALTIME) {
      throw new Error('Invalid channel for real-time strategy');
    }

    const notificationId = uuidv4();
    const notificationData = {
      id: notificationId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      createdAt: new Date(),
    };

    try {
      // First, persist the notification
      const persistedNotification = this.notificationRepository.create({
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        channel: notification.channel,
      });
      await this.notificationRepository.save(persistedNotification);

      // Check if user is online
      const isUserOnline = await this.notificationsGateway.getUserOnlineStatus(
        notification.userId
      );

      if (isUserOnline) {
        // Try to send notification
        const delivered =
          await this.notificationsGateway.sendNotificationToUser(
            notification.userId,
            notificationData
          );

        if (!delivered) {
          this.scheduleRetry(notification.userId, notificationData);
        }
      } else {
        // User is offline, store for retry
        this.logger.log(
          `User ${notification.userId} is offline, queuing notification ${notificationId}`
        );
        this.scheduleRetry(notification.userId, notificationData);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send real-time notification: ${errorMessage}`,
        errorStack
      );
      this.scheduleRetry(notification.userId, notificationData);
      throw new Error(`Failed to send real-time notification: ${errorMessage}`);
    }
  }

  private scheduleRetry(
    userId: number,
    notification: any,
    retryCount = 0
  ): void {
    if (retryCount >= this.MAX_RETRIES) {
      this.logger.warn(
        `Max retries reached for notification ${notification.id} to user ${userId}`
      );
      return;
    }

    this.pendingNotifications.set(notification.id, {
      notification,
      retries: retryCount,
    });

    setTimeout(async () => {
      try {
        const isUserOnline =
          await this.notificationsGateway.getUserOnlineStatus(userId);
        if (isUserOnline) {
          const delivered =
            await this.notificationsGateway.sendNotificationToUser(
              userId,
              notification
            );
          if (delivered) {
            this.pendingNotifications.delete(notification.id);
            this.logger.log(
              `Successfully delivered pending notification ${notification.id} to user ${userId}`
            );
          } else {
            this.scheduleRetry(userId, notification, retryCount + 1);
          }
        } else {
          this.scheduleRetry(userId, notification, retryCount + 1);
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Retry failed for notification ${notification.id}: ${errorMessage}`
        );
        this.scheduleRetry(userId, notification, retryCount + 1);
      }
    }, this.RETRY_INTERVAL);
  }

  private cleanupPendingNotifications(): void {
    const now = Date.now();
    for (const [id, data] of this.pendingNotifications.entries()) {
      const notificationAge =
        now - new Date(data.notification.createdAt).getTime();
      if (notificationAge > 24 * 60 * 60 * 1000) {
        // 24 hours
        this.pendingNotifications.delete(id);
        this.logger.log(`Cleaned up expired notification ${id}`);
      }
    }
  }
}
