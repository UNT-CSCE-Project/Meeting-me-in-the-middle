import {db} from '@/app/lib/firebaseAdmin.js';  // Make sure to configure Firebase
export async function getFriends() {
    try {
        const friendsSnapshot = await db.collection('friends')
        .where('status', '==', 'connected')
        .where('is_deleted', '==', false)
        .get();
        const friendsList = friendsSnapshot.docs.map((doc) => ({
            id: doc.id, // Get the document ID
            ...doc.data(), // Spread the document fields
        }));

        return friendsList; // Return the list of friends
    } catch (error) {
        console.error('Error fetching friends:', error);
        return []; // Return an empty array in case of an error
    }
}
export async function getPendingRequests() {
    try {
      // Query Firestore to get documents where status is 'pending'
      const friendsSnapshot = await db.collection('friends')
        .where('status', '==', 'pending')
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

