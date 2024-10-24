'use server';

import { z } from 'zod';
import { NotificationData } from './definitions';
import { db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';
import * as admin  from "firebase-admin";
const notificationSchema = z.object({
  type: z.string(),
  sender_uid: z.string(),
  sender_name: z.string(),
  recipient_uid: z.string(),
  recipient_name: z.string(),
  message: z.string(),
});
export async function addNotification(formData: NotificationData) {
  try {
    const parsedFormData = notificationSchema.parse(formData);


    const notificationRef = firebaseFirestore.collection('notifications').doc();
    await notificationRef.set({
      type: parsedFormData.type,
      sender_uid: parsedFormData.sender_uid,
      sender_name: parsedFormData.sender_name,
      recipient_uid: parsedFormData.recipient_uid,
      recipient_name: parsedFormData.recipient_name,
      message: parsedFormData.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      is_read: false,
    });
    return {
      status: 200,
      message: 'Notification sent successfully.',
    };
  } catch (error) {
    // console.log(error + " asdas ");
    return {
      status: 500,
      message: 'Firestore Error: Failed to send notification.',
    };
  }
}