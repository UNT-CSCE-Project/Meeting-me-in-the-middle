import { lusitana } from '@/app/ui/fonts';
import React, { Suspense } from "react";
import CardGrid from './CardGrid';
import { CardSkeleton } from '../../skeletons';
export default async function CurrentList() {
    return (
        <>
            <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-md`}>
                Total Friends : 100
            </h1>
            <Suspense fallback={<CardSkeleton />}>
                <CardGrid cards={[]} />
            </Suspense> 
            
        </>
    )
}