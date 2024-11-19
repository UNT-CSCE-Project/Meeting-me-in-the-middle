import { lusitana } from '@/app/ui/fonts';
import { CardSkeleton } from '../../skeletons';
import { CardGrid } from './CardGrid';
import * as definitions from '@/app/lib/friends/definitions';
import { Suspense } from "react";

export default function PendingRequests({
  pendingRequests, onAcceptRequest, onCancelRequest, isLoading}:{
    pendingRequests: definitions.pendingFriendItem[], 
    onAcceptRequest: Function, 
    onCancelRequest: Function,
    isLoading: boolean}) {
      
    return (
      <>    
        <h1 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-2xl text-blue-500`}>
          Pending Requests
        </h1>
        <Suspense fallback={<CardSkeleton />}>
        
          {isLoading ? (
            <CardSkeleton />
          ) : pendingRequests.length === 0 ? (
            <h6 className={`${lusitana.className} mt-4 ml-4 text-xl md:text-sm`}>
              No Record Found
            </h6>
          ) : (
            <CardGrid
              requests={pendingRequests}
              onAcceptRequest={onAcceptRequest}
              onCancelRequest={onCancelRequest}
              isLoading={isLoading}
            />
          )}
        </Suspense>
      </>
        
    )
}