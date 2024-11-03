'use server';

import { z } from 'zod';
import { NotificationData } from './definitions';
import { db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';
import * as admin  from "firebase-admin";
import { faY } from '@fortawesome/free-solid-svg-icons';
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

export async function updateNotificationStatus(id: string, status: boolean) {
  try {
    const docRef = firebaseFirestore.collection('notifications').doc(id);
    if((await docRef.get()).data()?.is_read === true) {
      return { status: 200, message: 'Status updated successfully.' };
    }
    await docRef.update({
      is_read: status,
    });
    return { status: 200, message: 'Status updated successfully.' };
  } catch (error) {
    console.error("Error updating status:", error);
    return { status: 500, message: 'Firestore Error: Failed to update status.' };
  }
  
}