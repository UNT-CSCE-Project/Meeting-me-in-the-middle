// page.tsx
"use client";
import '@/app/ui/global.css';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/app/UserContext';
export default function Home() {
  const {signOutUser} = useUser();
  const pathname = usePathname(); // Get the current route
    if(pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password'){
     signOutUser();
  
  }
  return (
    <div className="flex h-screen flex-col md:flex-row ">
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {/* You can add your main content here */}
        <h1 className="text-2xl font-bold">Welcome to Meet Me in the Middle!</h1>
        {/* You can add more content or components here */}
      </div>
    </div>
  );
}
