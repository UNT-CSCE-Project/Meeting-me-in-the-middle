import {db} from '@/app/lib/firebaseAdmin.js';  // Make sure to configure Firebase

export async function getFriends(currentUserId: string) {
  try {
    const currentUserId = "xo1sAzsKwYHfUoTaq2jN";
    if (!currentUserId) {
      throw new Error("currentUserId is undefined or null.");
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
    const friendsList = allFriendsDocs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document data (e.g., sender_id, recipient_id, status, etc.)
    }));

    return friendsList; // Return the list of friends
  } catch (error) {
    console.error('Error fetching friends:', error);
    return []; // Return an empty array in case of an error
  }
}

export async function getPendingRequests() {
    try {
      const currentUserId = "xo1sAzsKwYHfUoTaq2jN";
      // Query Firestore to get documents where status is 'pending'
      const friendsSnapshot = await db.collection('friends')
        .where('status', '==', 'pending')
        .where('recipient_id', '==', currentUserId)
        .where('is_deleted', '==', false)
        .get();
  
      // Map the results to an array of objects with the document ID and data
      const pendingFriends = friendsSnapshot.docs.map((doc) => ({
        id: doc.id, // Get the document ID
        ...doc.data(), // Spread the document fields
      }));
  
      return pendingFriends; // Return the filtered list of pending requests
    } catch (error) {
      console.error('Error fetching pending friend requests:', error);
      return []; // Return an empty array in case of an error
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