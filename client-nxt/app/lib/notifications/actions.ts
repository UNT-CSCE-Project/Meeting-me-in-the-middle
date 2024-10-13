'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';

export async function addNotification(formData: FormData) {
    try {
    const notificationRef = firebaseFirestore.collection('notifications').doc();
    await notificationRef.set({
      type: formData.get('type'),
      sender_id: formData.get('sender'),
      sender_name: formData.get('sender_name'),
      recipient_id: formData.get('recipient'),
      recipient_name: formData.get('recipient_name'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
      is_read: false,
    });
  } catch (error) {
    return {
      message: 'Firestore Error: Failed to Create Friend Request.',
    };
  }
}