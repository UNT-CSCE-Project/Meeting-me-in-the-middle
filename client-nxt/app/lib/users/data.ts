import {db} from '@/app/lib/firebaseAdmin.js';  


export async function fetchUserById(id: string) {
    try {
        const userSnapshot = await db.collection('users').doc(id).get();
        return userSnapshot.data();
    } catch (error) {
        return null;
    }
}
export async function fetchUsersByQuery(query: string) {
    try {
      // Fetch all users (be cautious with large datasets)
      const usersSnapshot = await db.collection('users').get();
  
      // Filter users based on the substring match (case-insensitive)
      const users = usersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => 
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLowerCase())
        );
  
      // Remove duplicates based on user id
      const uniqueUsers = Array.from(new Map(users.map(user => [user.id, user])).values());
  
      return uniqueUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
  