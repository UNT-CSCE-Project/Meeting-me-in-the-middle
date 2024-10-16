"use client";
import { lusitana } from '@/app/ui/fonts';
import React, { Suspense } from "react";
import CardGrid from './CardGrid';
import { getFriends } from '@/app/lib/friends/data';
import { CardSkeleton } from '../../skeletons';
import { useUser } from '@/app/UserContext';
import { useEffect, useState } from 'react';
export default function CurrentList() {
    
    const [friendData, setFriendData] = useState<any>([])
    const {currentUser} = useUser();
    const currentUserId = currentUser?.uid;

    useEffect(() => {
      const fetchFriends = async () => {
        try {
          if(currentUserId){
            const data = await getFriends(currentUser?.uid) ;
            // console.log(data);
            setFriendData(data);
          }
          
        } catch (error) {
          console.error(error);
        }
      };
      fetchFriends();
    }, currentUserId)
  
    // console.log(friendData)
    return (
      <Suspense fallback={<CardSkeleton />}>
        {friendData?.length === 0 ? (
          <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-2xl`}>
            No Friends Found
          </h1>
        ) : (
          <>
            <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-md`}>
              Total Friends: {friendData.length}
            </h1>
            
              <CardGrid friends={friendData} />
            
          </>
        )}
      </Suspense>
    );

}