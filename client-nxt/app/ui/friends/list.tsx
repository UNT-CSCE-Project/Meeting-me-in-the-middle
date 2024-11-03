"use client";
import { useState, useEffect, use, Suspense } from "react";
import {  getPendingRequests, getFriends } from "@/app/lib/friends/data";
import { addFriend, deleteFriend } from "@/app/lib/friends/actions";
import { pendingFriendItem, connectedFriendItem } from "@/app/lib/friends/definitions";
import { useUser } from "@/app/UserContext";
import { friendRequest, friend } from "@/app/lib/friends/definitions";
import PendingRequests from "@/app/ui/friends/pending/pendingRequests";
import CurrentList from "@/app/ui/friends/current/currentlist";
import { addNotification } from "@/app/lib/notifications/actions";
import { NotificationType } from "@/app/lib/notifications/definitions";
export default function FriendsList() {

    const { currentUser, userData } = useUser();
    // state for pending request and current friend list
    const [pendingRequests, setPendingRequests] = useState<pendingFriendItem[]>([]);
    /* TODO  add type for currentList*/
    const [currentList, setCurrentList] = useState<connectedFriendItem[]>([]);
    const [error, setError] = useState<string |null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [curUserId, setCurUserId] = useState("");

    useEffect(() => {
        if(currentUser?.uid) {
            setCurUserId(currentUser?.uid);
        }
    }, [currentUser]);
    useEffect(() => {
      const fetchPendingRequests = async () => {
          const pendingRequests = await getPendingRequests(curUserId.toString());
          // console.log(pendingRequests);
          if ('error' in pendingRequests) {
              setError(pendingRequests.error);
              return;
          }
          setPendingRequests(pendingRequests);
      }
  
      const fetchCurrentList = async () => {
          if (!curUserId) {
              return;
          }
          const currentList = await getFriends(curUserId.toString());
          if ('error' in currentList) {
              setError(currentList.error);
              return;
          }
          console.log(currentList);
          setCurrentList(currentList);
      }
  
      fetchPendingRequests();
      fetchCurrentList();
  }, [curUserId]);
  
    const handleAcceptRequest = async (request : friendRequest) => {
        setPendingRequests(pendingRequests.filter((r) => r.id !== request.id));
        setCurrentList([...currentList, request]);
        setIsLoading(true);

        try {
            const response = await addFriend(request.id); 
            if(response?.status === 500) {
              setError(response?.message);
              return;
            } 

          } catch (error) {
            setPendingRequests([...pendingRequests, request]);
            setCurrentList(currentList.filter((r) => r.id !== request.id));
            setError('Error accepting friend request:'+ error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleCancelRequest = async (request : friendRequest) => {
        setPendingRequests(pendingRequests.filter((r) => r.id !== request.id));
        setIsLoading(true);

        try{
          await deleteFriend(request.id);
          setError(null);
        } catch (error) {
            setPendingRequests([...pendingRequests, request]);
            setError('Error rejecting friend request:'+ error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleRemoveFriend = async (request : connectedFriendItem) => {
        // console.log( JSON.stringify(request) + " is being deleted");
        setIsRemoving(true);
        try{
          setCurrentList(currentList.filter((f) => f.id !== request.id));
        
          const response = await deleteFriend(request.id);
          if(response.status === 500) {
            setError(response.message);
          }

        } catch (error) {
            setCurrentList([...currentList, request]);
            setError('Error removing friend:'+ error);
        } finally {
           setIsRemoving(false);
        }
    }
    

  

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PendingRequests
          pendingRequests={pendingRequests}
          onAcceptRequest={handleAcceptRequest}
          onCancelRequest={handleCancelRequest}
          isLoading={isLoading}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
      
        <CurrentList
          items={currentList}
          onRemoveFriend={handleRemoveFriend}
          isRemoving={isRemoving}
          isLoading={isLoading}
        />
      </Suspense>
    </div>
  );
}