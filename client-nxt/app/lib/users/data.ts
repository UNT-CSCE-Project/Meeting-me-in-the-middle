import {db, auth} from '@/app/lib/firebaseAdmin.js';  

import { User, UserInfoWithStatus } from './definitions';

export async function fetchUserById(id: string) {
    try {
        const userSnapshot = await db.collection('users').doc(id).get();
        return userSnapshot.data();
    } catch (error) {
        return null;
    }
}
export async function fetchUsersByQuery(query: string, currentUserId: string) {
    try {
      // Fetch all users (be cautious with large datasets)
      const usersSnapshot = await db.collection('users').get();
  
      // Filter users based on the substring match (case-insensitive)
      const users = usersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }) as User) 
        .filter(user => 
          user.id != currentUserId && 
          (
            user?.firstName?.toLowerCase().includes(query.toLowerCase()) ||
            user?.lastName?.toLowerCase().includes(query.toLowerCase())
  
          )
        );
  
      // Remove duplicates based on user id
      const uniqueUsers = Array.from(new Map(users.map(user => [user.id, user])).values());
    
         // Check the status of each user from the Friends collection
      const results: UserInfoWithStatus[] = [];
      for (const user of uniqueUsers) {
        const userWithStatus: UserInfoWithStatus = {
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          status: 'not connected',
          requestId : '', // Default status
        };

        // Fetch friend requests where the user is either the sender or recipient
        const senderSnapshot = await db.collection('friends')
        .where('sender_id', '==', user.id)
        .where('is_deleted', '==', false)
        .get();
        const recipientSnapshot = await db.collection('friends')
        .where('recipient_id', '==', user.id)
        .where('is_deleted', '==', false)
        .get();

        // Combine sender and recipient friend requests
        // Create a Set to store unique friend document IDs
        const friendDocsSet = new Set<string>();

        // Combine sender and recipient friend requests, ensuring no duplicates
        const allFriendDocs = [...senderSnapshot.docs, ...recipientSnapshot.docs].filter((doc) => {
          if (!friendDocsSet.has(doc.id)) {
            friendDocsSet.add(doc.id); // Add unique document ID to the set
            return true; // Include in the final array
          }
          return false; // Exclude duplicates
        });

        // Update status if a matching friend request is found
        allFriendDocs.forEach(doc => {
          const friendData = doc.data();
          //console.log(friendData)
          if (friendData.sender_id === user.id || friendData.recipient_id === user.id) {
            userWithStatus.status = friendData.status; // Update status if found
            userWithStatus.requestId = doc.id;
            
          }
          
        });
        console.log(`results: ${userWithStatus}`)
        // Add to results array
        results.push(userWithStatus);
      }
      
      return results
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }  
