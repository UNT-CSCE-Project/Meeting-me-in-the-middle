import { lusitana } from '@/app/ui/fonts';
import { CardSkeleton } from '../../skeletons';
import React, { Suspense } from "react";
import { CardGrid } from './CardGrid';
import { getPendingRequests } from '@/app/lib/friends/data';


import Link from "next/link";
import { CardGridProps } from '../definitions';

export default async function PendingRequests() {
    const pendingRequests = await getPendingRequests() || [];
    
    return (
      <>
        {pendingRequests?.length === 0 ? (
          <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-2xl`}>
            No Pending Requests
          </h1>
        ) : (
          <>
            <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-md`}>
              Total Pending Requests : {pendingRequests?.length}
            </h1>
            <Suspense fallback={<CardSkeleton />}>
              <CardGrid requests={pendingRequests} />
            </Suspense>
          </>
        )}
      </>
        
    )
}

  

