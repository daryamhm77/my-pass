export * from './send-email.handler';
export * from './send-inapp.handler';
export * from './send-realtime.handler';

import { SendEmailHandler } from './send-email.handler';

export const NotificationHandlers = [SendEmailHandler];
