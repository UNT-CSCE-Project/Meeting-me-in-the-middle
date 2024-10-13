import { db } from '@/app/lib/firebaseAdmin.js';
export async function getNotificationCount() {
    try {
      // Query Firestore to get documents where status is 'pending'
    //   const notificationsSnapshot = await db.collection('notifications')
    //     .where('sender', '==', 'Avijeet Shil')
    //     .where('is_read', '==', false)
    //     .get();
  
    //     const unreadCount = notificationsSnapshot.docs.length;

        return 0;
    } catch (error) {
      console.error('Error fetching pending friend requests:', error);
      return []; // Return an empty array in case of an error
    }
}