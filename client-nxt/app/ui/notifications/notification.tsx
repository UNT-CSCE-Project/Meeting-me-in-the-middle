"use client";
import { NotificationData } from "@/app/lib/notifications/definitions";
import { db } from "@/app/lib/firebaseAdmin";
import { useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { set } from "zod";
import { NotificationType } from "@/app/lib/notifications/definitions";
import { updateNotificationStatus } from "@/app/lib/notifications/actions";

export async function Notification(notification: NotificationData) {
 
  const [isRead, setIsRead] = useState(notification.is_read);

  const router = useRouter();
   const handleNotificationClick = async (notification: NotificationData) => {
    
      const response = await updateNotificationStatus(notification.id, true);
      setIsRead(true);
      if (response.status === 200) {
        console.log("Notification status updated successfully."); 
        setIsRead(true);
        console.log(notification.type === NotificationType.FRIEND_REQUEST);
        if(notification.type === NotificationType.INVITATION_REQUEST) {
          router.push(`/location-approval`);
        } else if(notification.type === NotificationType.FRIEND_REQUEST) {
          router.push(`/friends`);
        }
      } else {
        console.error("Error updating notification status:", response.message);
      }
    
  }

  return (
    <div
className={`flex items-start p-4 mt-1 w-full rounded-lg border border-gray-200 shadow-sm transition duration-150 ease-in-out hover:shadow-md ${
  !isRead ? "bg-blue-200" : "bg-white"
}`}
    key={notification.id} 
    onClick={()=>handleNotificationClick(notification)}
  >
  

    <div className="flex-grow justify-start">
      <div className="text-gray-800">
        
        <span className="text-gray-700">{notification.message}</span>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {new Date(notification.timestamp).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          day: "numeric",
          month: "short",
        })}
      </p>
    </div>
    {
      !isRead && (
        <div className="flex-shrink-0 self-start mt-1">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600"
            }`}
          >
            New
          </span>
        </div>
      )
    }
    
  </div>
  );
}
