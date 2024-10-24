"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import Logo from '@/app/ui/logo';
import { PowerIcon } from '@heroicons/react/24/outline';
// import { signOut } from '@/auth'; // Uncomment this if you have signOut function
import { useEffect, useState } from 'react';
import { auth } from '@/app/lib/firebaseClient';
import { onAuthStateChanged, signOut  } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { fetchUserByUidAndEmail } from '@/app/lib/users/data';
import { useUser } from '@/app/UserContext';
import path from 'path';
export default function SideNav() {
  const pathname = usePathname(); // Get the current route
  const {signOutUser, currentUser} = useUser();
  
  // Determine if the user is authenticated based on the stored value
  const isAuthPage =  pathname === '/login' ||   pathname === '/registration' ||   pathname === '/forgot-password'; // Check if a user exists




  return (
    !isAuthPage ? (
      <div className="w-full flex-none md:w-64">
        <div className="flex h-full flex-col px-3 py-4 md:px-2" style={{ background: "#2c2c2c" }}>
          <Link
            className="mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40"
            href="/"
          >
            <div className="w-32 text-white md:w-40">
              <Logo />
            </div>
          </Link>
          <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2" style={{ background: "#2c2c2c" }}>
            <NavLinks />
            <div className="hidden h-auto w-full grow rounded-md md:block" style={{ background: "#2c2c2c" }}></div>
            <form>
              {/* Uncomment and implement the sign-out functionality if needed */}
              <button type="button" onClick={signOutUser} className="text-white">
                <PowerIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    ) : <></>
  );
}
