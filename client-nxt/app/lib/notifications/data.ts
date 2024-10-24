"use server";
import { useUser } from '@/app/UserContext';
import { db, auth } from '@/app/lib/firebaseAdmin.js';

export async function getNotificationCount(uid: string) {
    try {
  
     // Query Firestore to get documents where status is 'pending'
      const notificationsSnapshot = await db.collection('notifications')
        .where('recipient_uid', '==', uid)
        .get();
  
        const unreadCount = notificationsSnapshot.docs.length;

        
        return unreadCount;
    } catch (error) {
      console.error('Error fetching pending notifications:', error);
      return 0; // Return an empty array in case of an error
    }
}