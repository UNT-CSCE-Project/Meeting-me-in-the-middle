import { useUser } from '@/app/UserContext';
import { getNotificationCount } from '@/app/lib/notifications/data';
import { BellIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Notifications } from './notifications/notifications';

export default function NotificationButton() {
  const [notificationCount, setNotificationCount] = useState(0);
  const { userData } = useUser();
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (userData && userData.uid) {
      setLoading(true);
      getNotificationCount(userData.uid).then((count) => {
        setNotificationCount(count);
        setLoading(false);
      });
    }
  }, [userData]);

  return (
    <button onClick={() => setShowNotifications(!showNotifications)}>
      <div className="relative flex ml-4 items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
        <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-900" />
        <span className="absolute top-0 right-0 h-5 w-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
          {notificationCount}
        </span>
      </div>
      {showNotifications && (
        <div className="absolute top-14 mt-3 w-1/3 right-4 bg-white p-4 border border-gray-200 rounded" style={{ zIndex: 1000 }}>
          <h2 className="text-lg font-bold mb-2">Notifications</h2>
          <Notifications />
        </div>
      )}
    </button>
  );
}