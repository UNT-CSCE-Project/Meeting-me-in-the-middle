import { lusitana } from '@/app/ui/fonts';
import React, { Suspense } from "react";
import CardGrid from './CardGrid';
import { getFriends } from '@/app/lib/friends/data';
import { CardSkeleton } from '../../skeletons';
import { CardGridProps } from './definitions';
export default async function CurrentList() {
    const friendData: CardGridProps = await getFriends(); 
    console.log(friendData)
    return (
      <>
        {friendData.length === 0 ? (
          <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-2xl`}>
            No Friends Found
          </h1>
        ) : 
        (
          <>
            <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-md`}>
              Total Friends : {friendData.length}
            </h1>
            <Suspense fallback={<CardSkeleton />}>
              <CardGrid friends={friendData} />
            </Suspense>
          </>
        )}
      </>
    );
}