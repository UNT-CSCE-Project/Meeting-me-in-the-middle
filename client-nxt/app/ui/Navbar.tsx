"use client";
import Search from "./search";
import Error from "../ui/error";
import { lusitana } from '@/app/ui/fonts';
import { getNotificationCount } from '@/app/lib/notifications/data';
import Notification from "@/app/ui/Notification";
 
import { useUser } from "@/app/UserContext";
import Image from "next/image";
import {  BellIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import ProfileInfo from "./profileInfo";
import { Suspense, use } from "react";
import { ProfileInfoSkeleton } from "@/app/ui/skeletons";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { set } from "zod";
export default function Navbar() {
    const { signOutUser, userData } = useUser();
    const pathname = usePathname();
    const [notificationCount, setNotificationCount] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isPending, setIsPending] = useState(true);
    useEffect(() => {
        if(userData){
            console.log(userData);
            setFirstName(userData?.firstName);
            setLastName(userData?.lastName);
            getNotificationCount(userData?.uid).then((count) => {
                setNotificationCount(count);
                console.log('Notification count:', count);
            })  
            setIsPending(false);
    
        }
           
    }, [userData, notificationCount]);

    return (
     ( pathname === '/login' || pathname === '/registration'  ) ? <></> : (
        isPending ? 
            <></>:(
                <div className=" bg-[#2c2c2c] px-4">
                
                <div className="ml-20 mr-4 pt-4">
                    <div className="w-25 ml-8 flex items-center justify-between ">
                            
                            <Suspense fallback={<div>Loading...</div>}>
                                <Search placeholder="Search for friends" baseUrl="/friends"/>
                            </Suspense>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Notification notificationCount={notificationCount} />
                                
                                <ProfileInfo firstName = {firstName} lastName = {lastName}/>
                                <form>
                                {/* Uncomment and implement the sign-out functionality if needed */}
                                <button type="button" onClick={signOutUser} className="text-white">
                                    <ArrowRightEndOnRectangleIcon className="h-10 w-10" />
                                </button>
                                </form>
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
            )
    
          )
            )
           
    
}