"use client";

import Error from "../ui/error";
import { lusitana } from "@/app/ui/fonts";
import { getNotificationCount } from "@/app/lib/notifications/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";

import { useUser } from "@/app/UserContext";
import Image from "next/image";
import {
  BellIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ProfileInfo from "./profileInfo";
import React, { Suspense } from "react";
import { ProfileInfoSkeleton, SearchSkeleton } from "@/app/ui/skeletons";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { set } from "zod";
import { Notifications } from "./notifications/notifications";
import Search from "@/app/ui/search";
import NotificationButton from "@/app/ui/NotificationButton";
import { useTheme } from "@/app/ThemeProvider";

export default function Navbar() {
  const { signOutUser, userData } = useUser();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPending, setIsPending] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (userData && userData.firstName && userData.lastName) {
      console.log(userData);
      setFirstName(userData?.firstName);
      setLastName(userData?.lastName);

      setIsPending(false);
    }
  }, [userData]);

  return pathname === "/login" || pathname === "/registration" ? (
    <></>
  ) : (
    <div className=" bg-[#2c2c2c] px-4">
      <div className="ml-20 mr-4 pt-4">
        <div className="w-25 ml-8 flex items-center justify-between ab">
          <button
            className={`moon-button ${
              theme === "light" ? "text-black" : "text-white"
            }`}
            onClick={toggleTheme}
          >
            <FontAwesomeIcon icon={faMoon} size="lg" />
          </button>
          <Suspense fallback={<SearchSkeleton />}>
            <Search placeholder="Search for friends" baseUrl="/friends" />

            <NotificationButton />

            <ProfileInfo firstName={firstName} lastName={lastName} />

            <button type="button" onClick={signOutUser} className="text-white">
              <ArrowRightEndOnRectangleIcon className="h-10 w-10" />
            </button>
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
