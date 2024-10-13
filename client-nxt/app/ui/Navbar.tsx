"use client";
import Search from "./search";
import Error from "../ui/error";
import { lusitana } from '@/app/ui/fonts';
import { getNotificationCount } from '@/app/lib/notifications/data';
import Image from "next/image";
import {  BellIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
export default async function Navbar() {
    const [NotificationCount, setNotificationCount] = useState(0);
    let notificationCount = await getNotificationCount();
    console.log(notificationCount);
    return (
      <div className=" bg-[#2c2c2c] px-4">
                
                <div className="ml-20 mr-4 pt-4">
                    <div className="w-25 ml-8 flex items-center justify-between ">
                            <Search placeholder="Search for friends" />
                            <div className="relative flex ml-4 items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
                                <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-900" />
                                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{NotificationCount}</span>
                            </div>
                            <div className="h-10 w-10 ml-4 rounded-full overflow-hidden">
                                <img className="object-cover" src="https://picsum.photos/200/300" alt="Avatar" />
                                
                            </div>
                            <p className="mt-2 mr-4 text-white">Avijeet Shil</p>
                            
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