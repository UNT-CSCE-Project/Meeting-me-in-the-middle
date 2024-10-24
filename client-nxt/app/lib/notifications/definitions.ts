export enum NotificationType {
    FRIEND_REQUEST = 'friend_request',
    // Add other notification types as needed
  }

export type NotificationData = {
  type: string;
  sender_uid: string;
  sender_name: string;
  recipient_uid: string;
  recipient_name: string;
  message: string;
  timestamp: string;
  is_read: boolean;
}