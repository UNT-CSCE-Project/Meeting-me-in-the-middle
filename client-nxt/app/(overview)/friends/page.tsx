import Error from "../../ui/error";
import { lusitana } from '@/app/ui/fonts';
import Search from "../../ui/search";
import Link from "next/link";
import Table from "@/app/ui/friends/table";
import React, { Suspense } from "react";
import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
  } from '@heroicons/react/24/outline';
import { CardSkeleton } from "@/app/ui/skeletons";
import {  BellIcon } from '@heroicons/react/24/outline';
import Navbar from "@/app/ui/Navbar";
import PendingRequests from "@/app/ui/friends/pending/pendingRequests";
import CurrentList from "@/app/ui/friends/current/currentlist";

const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
  };
export default async function friends( {searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    return (
        <main>
            <Navbar />
            
                   
            <Suspense fallback={<div>Loading...</div>}>
              {query !== '' ? (
                <Table query={query} currentPage={currentPage} />
              ) : (
                <>
                  <PendingRequests />     
                  <CurrentList />    
                </>
              )}
            </Suspense>
        </main>
            
    );
}

