'use server';
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
              user.uid !== currentUserId &&
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
              uid: user.uid,
              name: `${user.firstName || ''} ${user.lastName || ''}`,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              status: 'not connected', // Default status
              requestId: '', // Default requestId
          };

          // Fetch friend requests where the user is either the sender or recipient
          const [senderSnapshot, recipientSnapshot] = await Promise.all([
              db.collection('friends')
                  .where('sender_id', '==', user.uid)
                  .where('is_deleted', '==', false)
                  .get(),
              db.collection('friends')
                  .where('recipient_id', '==', user.uid)
                  .where('is_deleted', '==', false)
                  .get()
          ]);

          // Combine sender and recipient friend requests
          const allFriendDocs = [...senderSnapshot.docs, ...recipientSnapshot.docs];

          // Check and update the user's status if a matching friend request is found
          for (const doc of allFriendDocs) {
              const friendData = doc.data();
              
              // Check if the current user is involved in the friend request
              if (friendData.sender_id === currentUserId || friendData.recipient_id === currentUserId) {
                  if (friendData.status === 'pending') {
                      userWithStatus.status = 'pending'; // Update status to pending
                      userWithStatus.requestId = doc.id; // Set the request ID
                      break; // Break the loop once a match is found
                  } else {
                      // If it's not pending, update to the other status if necessary
                      userWithStatus.status = friendData.status; // Update status if found
                      userWithStatus.requestId = doc.id; // Set the request ID
                  }
              }
          }

          // Add to results array
          results.push(userWithStatus);
      }

      return results;
  } catch (error) {
      console.error('Error fetching users:', error);
      return {
          message: 'Error fetching users',
      };
  }
}

export async function fetchUserByUidAndEmail(uid: string, email: string) {
  try {
    const userSnapshot = await db.collection('users')
      .where('uid', '==', uid)
      .where('email', '==', email)

      .get();

    if (userSnapshot.docs.length > 0) {
      const user = userSnapshot.docs[0].data();
      return user;
    } 
    return {
      message : 'User not found'
      
    }
  } catch (error) {
    //console.error('Error fetching user:', error);
    return {
      message : 'Error fetching user'
    };
   
  }
}