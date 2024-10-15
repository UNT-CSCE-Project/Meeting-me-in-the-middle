"use client";
import { useState } from "react";
import { friend } from "../definitions";
import { deleteFriend } from "@/app/lib/friends/actions";
import { UserAvatar } from "../../userAvatar";
import { useUser } from "@/app/UserContext";
export async function Card({ friend } : friend) {
  const { currentUser } = useUser();

  const currentUserId = currentUser?.uid || "";
    const [loading, setLoading] = useState(false);


    const handleCancel = async (requestId: string) => {
      setLoading(true);
      try {
    
        await deleteFriend(requestId);
    
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        setLoading(false);
      }
    };
    console.log("curre nt user id", currentUserId)
    return (
      <>
        <div className="rounded-xl bg-blue-50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start">
            {/* Avatar Section */}
            <UserAvatar firstName={friend.recipient_id != currentUserId ? friend.recipient_name : friend.sender_name} />
  
            {/* Name, Title and Address Section */}
            <div className="ml-4">
              <h3 className="text-sm font-medium">{friend.recipient_id !== currentUserId ? friend.recipient_name : friend.sender_name}</h3>
              <p className="text-xs text-gray-500">{friend.streetAddress+", "+friend.city+", "+friend.state+", "+friend.zipCode}</p>
            </div>
          </div>
  
          {/* Remove Button */}
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => handleCancel(friend.id)}
              disabled={loading}
              className="w-20 ml-2 rounded-lg bg-red-500 text-white py-2 hover:bg-red-600">
              Remove
            </button>
          </div>
        </div>
      </>
    );
  }