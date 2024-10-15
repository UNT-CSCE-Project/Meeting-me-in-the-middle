"use client";
import Search from "./search";

import Error from "../ui/error";
import { lusitana } from '@/app/ui/fonts';
import { useUser } from "@/app/UserContext";
import Image from "next/image";
import {  BellIcon } from '@heroicons/react/24/outline';
import ProfileInfo from "./profileInfo";
import { Suspense } from "react";
import { ProfileInfoSkeleton } from "@/app/ui/skeletons";
export default function Navbar() {
    
    
    return (
      <div className=" bg-[#2c2c2c] px-4">
                
                <div className="ml-20 mr-4 pt-4">
                    <div className="w-25 ml-8 flex items-center justify-between ">
                            <Search placeholder="Search for friends" />
                            
                            <Suspense fallback={<ProfileInfoSkeleton />}>
                                <div className="relative flex ml-4 items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
                                    <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-900" />
                                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">1</span>
                                </div>
                                <ProfileInfo />
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