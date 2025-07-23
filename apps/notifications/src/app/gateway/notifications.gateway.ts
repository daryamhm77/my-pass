import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // Configure this according to your needs
  },
  namespace: 'notifications',
  pingInterval: 10000, // 10 seconds
  pingTimeout: 5000, // 5 seconds
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets: Map<number, Set<string>> = new Map();
  private readonly rateLimiter: RateLimiterMemory;

  constructor() {
    // Allow 100 connections per minute per IP
    this.rateLimiter = new RateLimiterMemory({
      points: 100,
      duration: 60,
    });
  }

  async handleConnection(client: Socket) {
    try {
      const userId = this.getUserIdFromSocket(client);
      const ip = client.handshake.address;

      // Rate limiting
      await this.rateLimiter.consume(ip);

      if (!userId) {
        this.logger.warn(`Connection rejected: No userId provided from ${ip}`);
        client.disconnect();
        return;
      }

      this.addUserSocket(userId, client.id);
      await client.join(`user:${userId}`);

      // Send connection acknowledgment
      client.emit('connected', { status: 'success', timestamp: new Date() });

      this.logger.log(
        `Client connected: ${client.id} for user: ${userId} from ${ip}`
      );

      // Setup ping-pong for connection health check
      client.on('ping', () => {
        client.emit('pong', { timestamp: new Date() });
      });
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (userId) {
        this.removeUserSocket(userId, client.id);
        this.logger.log(
          `Client disconnected: ${client.id} for user: ${userId}`
        );
      }
    } catch (error) {
      this.logger.error('Disconnection error:', error);
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket): void {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      client.join(`user:${userId}`);
      client.emit('subscribed', { status: 'success', timestamp: new Date() });
    }
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket): void {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      client.leave(`user:${userId}`);
      client.emit('unsubscribed', { status: 'success', timestamp: new Date() });
    }
  }

  async sendNotificationToUser(
    userId: number,
    notification: any
  ): Promise<boolean> {
    try {
      const room = `user:${userId}`;
      const sockets = await this.server.in(room).allSockets();

      if (sockets.size === 0) {
        this.logger.warn(`No active connections for user: ${userId}`);
        return false;
      }

      // Send with acknowledgment
      const sendPromises = Array.from(sockets).map(
        (socketId) =>
          new Promise<void>((resolve, reject) => {
            this.server
              .to(socketId)
              .emit('notification', notification, (error: any, ack: any) => {
                if (error) reject(error);
                else resolve();
              });
            // Timeout after 5 seconds
            setTimeout(
              () => reject(new Error('Notification acknowledgment timeout')),
              5000
            );
          })
      );

      await Promise.all(sendPromises);
      this.logger.log(
        `Notification sent to user ${userId} on ${sockets.size} connections`
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${userId}:`,
        error
      );
      throw new WsException('Failed to send notification');
    }
  }

  async getUserOnlineStatus(userId: number): Promise<boolean> {
    const sockets = this.userSockets.get(userId);
    return sockets !== undefined && sockets.size > 0;
  }

  private getUserIdFromSocket(client: Socket): number | null {
    try {
      const userId =
        client.handshake.auth.userId || client.handshake.query.userId;
      return userId ? Number(userId) : null;
    } catch (error) {
      this.logger.error('Error parsing userId:', error);
      return null;
    }
  }

  private addUserSocket(userId: number, socketId: string): void {
    const userSockets = this.userSockets.get(userId) || new Set();
    userSockets.add(socketId);
    this.userSockets.set(userId, userSockets);
  }

  private removeUserSocket(userId: number, socketId: string): void {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }
}
