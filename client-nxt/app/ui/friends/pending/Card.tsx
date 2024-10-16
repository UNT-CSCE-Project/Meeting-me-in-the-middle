"use client";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { addFriend, deleteFriend } from '@/app/lib/friends/actions';
import { friend } from "../definitions";
import { useUser } from '@/app/UserContext';
import { UserAvatar } from "../../userAvatar";
import { Connect } from "../buttons";
export function Card({request, fetchPendingRequests} : {request : any, fetchPendingRequests: any}) {
    const { currentUser } = useUser();

    const currentUserId = currentUser?.uid || "";
    const [loading, setLoading] = useState(false);
    
    const handleConnect = async (requestId: string) => {
      fetchPendingRequests(requestId)
    };
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
    console.log(request);
    const firstName = request.sender_name.split(' ')[0]
    const lastName = request.sender_name.split(' ')[1]
    return (
      
      <div className="rounded-xl bg-blue-50 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-start">
        {/* Avatar Section */}
        <UserAvatar firstName={firstName} lastName={lastName} />

        {/* Name, Title and Address Section */}
        <div className="ml-4">
          <h3 className="text-sm font-medium">{request.sender_name}</h3>
          <p className="text-xs text-gray-500">{request.request_send_time}</p>
        </div>
      </div>

      

      {/* Connect and Deny Buttons */}
      <div className="mt-4 flex justify-end">
        <Connect
          request_id={request.id}
          onConnect={() => handleConnect(request.id)} // Correctly pass the requestId here
        />
        <button 
          onClick={() => handleCancel(request.id)}
          disabled={loading}
          className="w-20 ml-2 rounded-lg bg-red-500 text-white py-2 hover:bg-red-600">
          {loading ? 'Cancelling...' : 'Cancel'}
        </button>
      </div>
    </div>
    );
  }
  