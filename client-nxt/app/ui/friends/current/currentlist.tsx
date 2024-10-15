import { lusitana } from '@/app/ui/fonts';
import React, { Suspense } from "react";
import CardGrid from './CardGrid';
import { getFriends } from '@/app/lib/friends/data';
import { CardSkeleton } from '../../skeletons';
import { CardGridProps } from "@/app/ui/friends/definitions";
export default async function CurrentList() {


    const friends = await getFriends("") || []; // Ensure this returns an array of friends
    console.log(friends);
    
    // Ensure friends is of type friend[]
    const friendData: CardGridProps = { friends };
    console.log(friendData);
    return (
      <>
        {friendData.friends?.length === 0 ? (
          <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-2xl`}>
            No Friends Found
          </h1>
        ) : (
          <>
            <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-md`}>
              Total Friends: {friendData.friends?.length}
            </h1>
            <Suspense fallback={<CardSkeleton />}>
              <CardGrid friends={friendData.friends} />
            </Suspense>
          </>
        )}
      </>
    );

}