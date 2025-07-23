import { CreateNotificationDto } from '../dto/create-notification.dto';

export interface NotificationStrategy {
  send(notification: CreateNotificationDto): Promise<void>;
}
