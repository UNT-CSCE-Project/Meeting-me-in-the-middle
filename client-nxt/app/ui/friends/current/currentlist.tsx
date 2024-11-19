
import { lusitana } from '@/app/ui/fonts';
import React, { Suspense } from "react";
import CardGrid from './CardGrid';
import { CardSkeleton } from '../../skeletons';
import { connectedFriendItem } from '@/app/lib/friends/definitions';
export default function CurrentList({items, 
  onRemoveFriend, 
  isRemoving,
  isLoading
} :{
    items: connectedFriendItem[],
    onRemoveFriend: Function,
    isRemoving: boolean,
    isLoading: boolean
  }) {
    
  
    // console.log(friendData)
   return (
     <>
       <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-2xl text-blue-500`}>
         Current Friends
       </h1>
       <Suspense fallback={<CardSkeleton />}>
         {
           isLoading ? (
             <CardSkeleton />
           ) : items?.length === 0 ? (
             <h6 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-sm`}>
               No Record Found
               <p className="text-gray-500 text-sm md:text-md mt-2">
             "You miss 100% of the shots you don't take." - Wayne Gretzky
           </p>
           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
             Add Friends
           </button>
             </h6>
             
           ) : (
             <>
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