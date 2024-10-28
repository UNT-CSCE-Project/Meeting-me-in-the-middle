
import { lusitana } from '@/app/ui/fonts';
import React, { Suspense } from "react";
import CardGrid from './CardGrid';
import { CardSkeleton } from '../../skeletons';
import { connectedFriendItem } from '@/app/lib/friends/definitions';
export default function CurrentList({items, 
  onRemoveFriend, 
  isRemoving} :{
    items: connectedFriendItem[],
    onRemoveFriend: Function,
    isRemoving: boolean
  }) {
    
  
    // console.log(friendData)
    return (
      <>
        <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-2xl text-blue-500`}>
          Current Friends
        </h1>
        <Suspense fallback={<CardSkeleton />}>
        {
          isRemoving ? <CardSkeleton/> : items?.length === 0 ? (
            <h6 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-sm`}>
              No Record Found
            </h6>
          ) : (            <>
            <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-md`}>
              Total Friends: {items.length}
            </h1>
            
            <CardGrid 
              friends={items} 
              onRemoveFriend={onRemoveFriend}
              isRemoving={isRemoving}
            />
            
          </>
          )
        }
          
        </Suspense>
      </>
      
    );

}