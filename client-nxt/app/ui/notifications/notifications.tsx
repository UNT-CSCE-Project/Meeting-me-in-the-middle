import { NotificationData } from "@/app/lib/notifications/definitions";
import { getNotifications } from "@/app/lib/notifications/data";
import { useUser } from "@/app/UserContext";
import { Notification } from "./notification";
import React, { useEffect, useState } from "react";

export const Notifications = ({ decrementNotificationCount }: { decrementNotificationCount: () => void }) => {
  const { userData } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (userData && userData.uid) {
          const data = await getNotifications(userData.uid);
          setNotifications(data as NotificationData[]);
          setError(null);
        }
      } catch (error) {
        setError("Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userData]);

  return (
    loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>{error}</div>
    ) : (
      notifications?.length > 0 ? (
        <div className="flex flex-col p-4 space-y-4 mt-2 w-full items-start">
          {notifications.map((notification, index) => (
            <Notification key={index} notification={notification} decrementNotificationCount={decrementNotificationCount} />
          ))}
        </div>
      ) : (
        <div>No notifications found.</div>
      )
    )
  );
}
