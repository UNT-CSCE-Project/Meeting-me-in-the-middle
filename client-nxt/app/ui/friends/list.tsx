"use client";
import { useState, useEffect } from "react";
import {  getPendingRequests, getFriends } from "@/app/lib/friends/data";
import { addFriend, deleteFriend } from "@/app/lib/friends/actions";
import { pendingFriendItem, connectedFriendItem } from "@/app/lib/friends/definitions";
import { useUser } from "@/app/UserContext";
import { friendRequest, friend } from "@/app/lib/friends/definitions";
import PendingRequests from "@/app/ui/friends/pending/pendingRequests";
import CurrentList from "@/app/ui/friends/current/currentlist";
export default function FriendsList() {

    const { currentUser } = useUser();
    // state for pending request and current friend list
    const [pendingRequests, setPendingRequests] = useState<pendingFriendItem[]>([]);
    /* TODO  add type for currentList*/
    const [currentList, setCurrentList] = useState<connectedFriendItem[]>([]);
    const [error, setError] = useState<string |null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    useEffect(() => {
        if(!currentUser) {
            return;
        }
        const fetchPendingRequests = async () => {
            const pendingRequests = await getPendingRequests(currentUser?.uid);
            ;
            if ('error' in pendingRequests) {
                setError(pendingRequests.error);
                return;
            } 
            setPendingRequests(pendingRequests);
        };
    
        const fetchCurrentList = async () => {
            const currentList = await getFriends(currentUser?.uid);
            if('error' in currentList) {
                setError(currentList.error);
                return;
            }
            setCurrentList(currentList);
         
        }

        fetchPendingRequests();
        fetchCurrentList();
    }, [currentUser]);

    const handleAcceptRequest = async (request : friendRequest) => {
        setPendingRequests(pendingRequests.filter((r) => r.id !== request.id));
        setCurrentList([...currentList, request]);
        setIsLoading(true);

        try {
            await addFriend(request.id); 
            setError(null);
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
        console.log( JSON.stringify(request) + " is being deleted");
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
      <PendingRequests
        pendingRequests={pendingRequests}
        onAcceptRequest={handleAcceptRequest}
        onCancelRequest={handleCancelRequest}
        isLoading={isLoading}
      />
      <CurrentList
        items={currentList}
        onRemoveFriend={handleRemoveFriend}
        isRemoving={isRemoving}
      />
    </div>
  );
}