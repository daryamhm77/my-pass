import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan } from 'typeorm';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import {
  SendEmailHandler,
  SendInAppHandler,
  SendRealTimeHandler,
} from '../events/handlers';
import { NotificationChannel } from '../enums/ notification-channel.enum';
import { NotificationType } from '../enums/ notification-type.enum';
import { Notification } from '../entity/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly sendEmailHandler: SendEmailHandler,
    private readonly sendInAppHandler: SendInAppHandler,
    private readonly sendRealTimeHandler: SendRealTimeHandler
  ) {}

  async send(notification: CreateNotificationDto): Promise<void> {
    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmailHandler.execute(notification);
        break;
      case NotificationChannel.IN_APP:
        await this.sendInAppHandler.execute(notification);
        break;
      case NotificationChannel.REALTIME:
        await this.sendRealTimeHandler.execute(notification);
        break;
      default:
        throw new Error(
          `Unsupported notification channel: ${notification.channel}`
        );
    }
  }

  async sendEmail(
    userId: number,
    to: string,
    subject: string,
    message: string
  ): Promise<void> {
    const notification: CreateNotificationDto = {
      userId,
      to,
      subject,
      message,
      channel: NotificationChannel.EMAIL,
      type: NotificationType.INFO,
    };

    await this.sendEmailHandler.execute(notification);
  }

  async sendInApp(
    userId: number,
    title: string,
    message: string
  ): Promise<void> {
    const notification: CreateNotificationDto = {
      userId,
      title,
      message,
      channel: NotificationChannel.IN_APP,
      type: NotificationType.INFO,
    };

    await this.sendInAppHandler.execute(notification);
  }

  async sendRealTime(
    userId: number,
    title: string,
    message: string
  ): Promise<void> {
    const notification: CreateNotificationDto = {
      userId,
      title,
      message,
      channel: NotificationChannel.REALTIME,
      type: NotificationType.INFO,
    };

    await this.sendRealTimeHandler.execute(notification);
  }

  async getUserNotifications(
    userId: number,
    page = 1,
    limit = 10,
    isRead?: boolean
  ): Promise<[Notification[], number]> {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.channel = :channel', {
        channel: NotificationChannel.IN_APP,
      })
      .andWhere(
        '(notification.scheduledAt IS NULL OR notification.scheduledAt <= :now)',
        { now: new Date() }
      )
      .andWhere(
        '(notification.expiresAt IS NULL OR notification.expiresAt > :now)',
        { now: new Date() }
      );

    if (typeof isRead === 'boolean') {
      query.andWhere('notification.isRead = :isRead', { isRead });
    }

    return query
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async markAsRead(userId: number, notificationId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    const now = new Date();
    await this.notificationRepository.update(
      {
        userId,
        isRead: false,
        channel: NotificationChannel.IN_APP,
      },
      {
        isRead: true,
        readAt: now,
      }
    );
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: {
        userId,
        isRead: false,
        channel: NotificationChannel.IN_APP,
        scheduledAt: LessThanOrEqual(new Date()),
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async deleteNotification(
    userId: number,
    notificationId: number
  ): Promise<void> {
    const result = await this.notificationRepository.softDelete({
      id: notificationId,
      userId,
    });

    if (!result.affected) {
      throw new NotFoundException('Notification not found');
    }
  }
}
