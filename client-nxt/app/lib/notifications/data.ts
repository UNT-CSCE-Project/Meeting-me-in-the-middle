"use server";
import { useUser } from '@/app/UserContext';
import { db, auth } from '@/app/lib/firebaseAdmin.js';
import { NotificationData } from './definitions';

export async function getNotificationCount(uid: string) {
    try {
      if(uid == undefined || uid == null) {
        console.log("uid ", uid);
        return 0
      }
     // Query Firestore to get documents where status is 'pending'
      const notificationsSnapshot = await db.collection('notifications')
        .where('recipient_uid', '==', uid?.toString())
        .where('is_read', '==', false)
        .get();
  
        const unreadCount = notificationsSnapshot.docs.length;

        
        return unreadCount;
    } catch (error) {
      console.log("uid ", uid);
      console.error('Error fetching pending notifications:', error);
      return 0; // Return an empty array in case of an error
    }
}


export async function getNotifications(uid: string) {
  try {
    if(uid == undefined || uid == null) {
      console.log("uid ", uid);
      return []
    }
   // Query Firestore to get documents where status is 'pending'
    const notificationsSnapshot = await db.collection('notifications')
      .where('recipient_uid', '==', uid?.toString())
      .orderBy('timestamp', 'desc')
      .get();

      
      return notificationsSnapshot.docs.map((doc) =>({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toISOString(),
        is_read: doc.data().is_read
  }));
  } catch (error) {
    console.log("uid ", uid);
    console.error('Error fetching pending notifications:', error);
    return []; // Return an empty array in case of an error
  }
}