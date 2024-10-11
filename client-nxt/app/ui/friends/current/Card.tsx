"use client";
import { useState } from "react";
import { friend } from "../definitions";
import { deleteFriend } from "@/app/lib/friends/actions";
export async function Card({ friend } : friend) {

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
    return (
      <>
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
              <h3 className="text-sm font-medium">{friend.recipient}</h3>
              <p className="text-xs text-gray-500">{friend.request_send_time}</p>
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