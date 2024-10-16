"use client";
import { useState, useEffect } from 'react';

import { lusitana } from '@/app/ui/fonts';
import { CardSkeleton } from '../../skeletons';
import React, { Suspense } from "react";
import { CardGrid } from './CardGrid';
import { getPendingRequests } from '@/app/lib/friends/data';


import Link from "next/link";
import { CardGridProps } from '../definitions';
import { useUser } from '@/app/UserContext';
export default function PendingRequests() {
  const [pendingRequests, setPendingRequests] = useState<any>([])
  const {currentUser} = useUser();
  const currentUserId = currentUser?.uid
  const fetchPendingRequests = async () => {
    try {
      if(currentUserId){
        const data = await getPendingRequests(currentUser?.uid) ;
        // console.log(data);
        setPendingRequests(data);
      }
      
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    
    fetchPendingRequests();
  }, currentUserId)
    console.log(pendingRequests)
    return (
      <Suspense fallback={<CardSkeleton />}>
        {pendingRequests?.length === 0 ? (
          <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-2xl`}>
            No Pending Requests
          </h1>
        ) : (
          <>
            <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-md`}>
              Total Pending Requests : {pendingRequests?.length}
            </h1>
            
              <CardGrid requests={pendingRequests} fetchPendingRequests={fetchPendingRequests}/>
            
          </>
        )}
      </Suspense>
        
    )
}

  

