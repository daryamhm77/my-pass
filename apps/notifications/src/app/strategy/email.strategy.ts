import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationStrategy } from './notification.strategy';
import { NotificationChannel } from '../enums/ notification-channel.enum';

@Injectable()
export class EmailStrategy implements NotificationStrategy {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('SMTP_USER'),
        clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
        refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
      },
    });
  }

  async send(notification: CreateNotificationDto): Promise<void> {
    if (notification.channel !== NotificationChannel.EMAIL) {
      throw new Error('Invalid channel for email strategy');
    }

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: notification.to,
      subject: notification.subject || 'Notification',
      text: notification.message,
    });
  }
}
