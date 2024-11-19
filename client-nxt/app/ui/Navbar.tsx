"use client";

import Error from "../ui/error";
import { lusitana } from "@/app/ui/fonts";
import { getNotificationCount } from "@/app/lib/notifications/data";


import { useUser } from "@/app/UserContext";
import Image from "next/image";
import {
  BellIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ProfileInfo from "./profileInfo";
import React, { Suspense } from 'react';
import { ProfileInfoSkeleton, SearchSkeleton } from "@/app/ui/skeletons";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { set } from "zod";
import { Notifications } from "./notifications/notifications";
import Search from "@/app/ui/search";
import NotificationButton from "@/app/ui/NotificationButton";

export default function Navbar() {
  const { signOutUser, userData } = useUser();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ email, setEmail ] = useState("");
  const [isPending, setIsPending] = useState(true);
  
  useEffect(() => {
    if (userData && userData.firstName && userData.lastName && userData.email) {
      console.log(userData);
      setFirstName(userData?.firstName);
      setLastName(userData?.lastName);
      setEmail(userData?.email);
      setIsPending(false);
    }
  }, [userData]);

  return pathname === "/login" || pathname === "/registration" ? (
    <></>
  ) : (

    <div className=" bg-[#2c2c2c] px-4">
      <div className="ml-20 mr-4 pt-4">
        <div className="w-25 ml-8 flex items-center justify-between ab">
          <Suspense fallback={<SearchSkeleton/>}>
            <Search placeholder="Search for friends" baseUrl="/friends" />
            <div className="relative flex">
            <NotificationButton />

            <ProfileInfo firstName={firstName} lastName={lastName} email={email}/>
           
              <button
                type="button"
                onClick={signOutUser}
                className="text-white"
              >  Sign Out
                <ArrowRightEndOnRectangleIcon className="h-10 w-10" />
              </button>
              </div>
          </Suspense>
        </div>
      </div>
      {/* <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                    <Table query={query} currentPage={currentPage} />
                </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
