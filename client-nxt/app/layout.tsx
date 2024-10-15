

import SideNav from '@/app/ui/sidenav';


import '@/app/ui/global.css';
import { lusitana } from '@/app/ui/fonts';
import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebaseClient';
import { fetchUserByUidAndEmail } from '@/app/lib/users/data';
import { set } from 'zod';
import { UserProvider } from '@/app/UserContext';
export const experimental_ppr = true;
import { useUser } from '@/app/UserContext';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <UserProvider>
      <html lang="en">
          <body className={`${lusitana.className} antialiased`}>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
              <SideNav /> 
              <div className="flex-grow">{children}</div>
            </div>
      </body>
      </html>
    </UserProvider>

  );
}
