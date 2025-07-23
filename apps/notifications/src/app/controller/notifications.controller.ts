import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { NotificationsService } from '../service/notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../entity/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async createNotification(
    @Body() notification: CreateNotificationDto
  ): Promise<void> {
    await this.notificationsService.send(notification);
  }

  @Get('user/:userId')
  async getUserNotifications(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('isRead') isRead?: boolean
  ): Promise<{ notifications: Notification[]; total: number }> {
    const [notifications, total] =
      await this.notificationsService.getUserNotifications(
        userId,
        page,
        limit,
        isRead
      );
    return { notifications, total };
  }

  @Get('user/:userId/unread-count')
  async getUnreadCount(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':notificationId/mark-read')
  async markAsRead(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Query('userId', ParseIntPipe) userId: number
  ): Promise<void> {
    await this.notificationsService.markAsRead(userId, notificationId);
  }

  @Patch('user/:userId/mark-all-read')
  async markAllAsRead(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<void> {
    await this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':notificationId')
  async deleteNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Query('userId', ParseIntPipe) userId: number
  ): Promise<void> {
    await this.notificationsService.deleteNotification(userId, notificationId);
  }
}
