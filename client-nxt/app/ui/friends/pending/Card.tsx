"use client";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { addFriend, deleteFriend } from '@/app/lib/friends/actions';
import { friend } from "../definitions";
export function Card({request} : friend) {
    const currentUserId = "xo1sAzsKwYHfUoTaq2jN";
    const [loading, setLoading] = useState(false);
    const handleConnect = async (requestId: string) => {
      setLoading(true);
      try {
       

           await addFriend(requestId);
    
          console.log('Friend request created successfully:', requestId);
          
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        setLoading(false);
      }
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
    return (
      
      <div className="rounded-xl bg-blue-50 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-start">
        {/* Avatar Section */}
        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
          <img
            className="object-cover"
            src={"https://picsum.photos/200/300"} // Add dynamic avatar URL
            alt="Avatar"
            width={50}
            height={50}
          />
        </div>

        {/* Name, Title and Address Section */}
        <div className="ml-4">
          <h3 className="text-sm font-medium">{request.name}</h3>
          <p className="text-xs text-gray-500">{request.request_send_time}</p>
        </div>
      </div>

      

      {/* Connect and Deny Buttons */}
      <div className="mt-4 flex justify-end">
        <button 
          onClick={() => handleConnect(request.id)}
          disabled={loading}
          className="w-20 mr-2 rounded-lg bg-green-500 text-white py-2 hover:bg-green-600">
          {loading ? 'Connecting...' : 'Connect'}
        </button>
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
  