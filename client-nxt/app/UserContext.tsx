 // Indicate this is a client component
"use client";
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebaseClient';
import "@/app/ui/global.css";
import { fetchUserByUidAndEmail } from '@/app/lib/users/data';
import { useRouter } from 'next/navigation'; // Use the correct import for Next.js 13+
import { usePathname } from 'next/navigation';
// Define the user context interface
interface UserContextType {
  currentUser: any;
  userData: any;
  signOutUser: () => Promise<void>;
}

// Create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Context Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter(); // Move useRouter here
  const pathname = usePathname(); // Get the current route
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const fetchedUserData =  await fetchUserByUidAndEmail(user.uid, user.email || "");
        setUserData(fetchedUserData);
        // console.log('User signed in:', user);
      } else {
        setCurrentUser(null);
        setUserData(null);
        if(pathname !== '/registration')
        router.push('/login');
        // console.log('User signed out');
      }
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
      router.push('/login'); // Redirect after signing out
    } catch (error) {
      
      console.error('Error signing out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, userData, signOutUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use the user context
export function useUser() {
 
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
