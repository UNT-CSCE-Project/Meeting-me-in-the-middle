"use server";
import {db} from '@/app/lib/firebaseAdmin.js';  // Make sure to configure Firebase

export async function getFriends(currentUserId: string) {
  try {
    if(!currentUserId) {
      throw new Error('No user ID found in getFriends');
    }
    
    
    // Fetch friends where the user is either the sender or recipient and the status is 'connected'
    const senderSnapshot = await db.collection('friends')
      .where('sender_id', '==', currentUserId)
      .where('status', '==', 'connected')
      .where('is_deleted', '==', false)
      .get();

    const recipientSnapshot = await db.collection('friends')
      .where('recipient_id', '==', currentUserId)
      .where('status', '==', 'connected')
      .where('is_deleted', '==', false)
      .get();

    // Combine results from both sender and recipient queries
    const allFriendsDocs = [...senderSnapshot.docs, ...recipientSnapshot.docs];

    // Map the friend documents to extract relevant data
    const friendsList = await Promise.all(
      allFriendsDocs.map(async (doc) => {
        const uid = doc.data().sender_id == currentUserId ? doc.data().recipient_id : doc.data().sender_id;
        const userRef = db.collection('users').where('uid', '==', uid);
        const userData = await userRef.get();
    
        const userDoc = userData.docs[0]; // Get the first document (assuming there's only one)
        return {
          id: doc.id,
          friend_uid: uid,
          friend_name: userDoc?.data()?.firstName + ' ' + userDoc?.data()?.lastName,
          status: doc.data().status,
          request_send_time: doc.data().request_send_time,
          is_deleted: doc.data().is_deleted,
          streetAddress: userDoc?.data()?.streetAddress,
          city: userDoc?.data()?.city,
          state: userDoc?.data()?.state,
          zipCode: userDoc?.data()?.zipCode,
        };
      })
    );
    return friendsList; // Return the list of friends
  } catch (error) {
    return {
      error: 'Error fetching friends',}
  }
}

export async function getPendingRequests(currentUserId: string) {
    try {
      if(!currentUserId) {
        throw new Error('No user ID found in getPendingRequests');
      }
  
      // Query Firestore to get documents where status is 'pending'
      const friendsSnapshot = await db.collection('friends')
        .where('status', '==', 'pending')
        .where('recipient_id', '==', currentUserId)
        .where('is_deleted', '==', false)
        .get();
  
      // Map the results to an array of objects with the document ID and data
      const pendingFriends = await Promise.all(
        friendsSnapshot.docs.map(async (doc) => {
          const uid = doc.data().sender_id;
              const userRef = db.collection('users').where('uid', '==', uid);
              const userData = await userRef.get();
          
              const userDoc = userData.docs[0]; // Get the first document (assuming there's only one)
              return {
                id: doc.id,
                friend_uid: doc.data().uid,
                friend_name: userDoc?.data()?.firstName + ' ' + userDoc?.data()?.lastName,
                status: doc.data().status,
                request_send_time: doc.data().request_send_time,
                streetAddress: userDoc?.data()?.streetAddress,
                city: userDoc?.data()?.city,
                state: userDoc?.data()?.state,
                zipCode: userDoc?.data()?.zipCode,
                is_deleted: false,
                sender_id: doc.data().sender_id,
                sender_name: userDoc?.data()?.firstName + ' ' + userDoc?.data()?.lastName,
                recipient_id: doc.data().recipient_id,
                recipient_name: doc.data().recipient_name,
              };
        })
);
      return pendingFriends; // Return the filtered list of pending requests
    } catch (error) {
      
      return {
        error: 'error fetching pending requests',
      }; // Return an empty array in case of an error
    }
}

export async function fetchFriendRequestIdBySenderIdAndRecipientId(sender_id: string, recipient_id: string) {
  try{
    const requestSnapshot = await db.collection('friends')
    .where('sender_id', '==', sender_id)
    .where('recipient_id', '==', recipient_id).get();

    if (requestSnapshot.empty) {
      return null;
    }
    return requestSnapshot.docs[0].id;
  } catch (error) {
    console.error('Error fetching pending friend requests:', error);
    return [];
  }
}