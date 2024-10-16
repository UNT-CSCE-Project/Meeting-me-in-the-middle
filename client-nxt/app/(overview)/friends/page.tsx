
import Table from "@/app/ui/friends/table";
import React, { Suspense } from "react";


import Navbar from "@/app/ui/Navbar";
import PendingRequests from "@/app/ui/friends/pending/pendingRequests";
import CurrentList from "@/app/ui/friends/current/currentlist";


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

