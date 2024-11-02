
import { useUser } from '@/app/UserContext';
import { getNotificationCount } from '@/app/lib/notifications/data';
import { BellIcon } from '@heroicons/react/24/outline';
import { use, useEffect, useState } from 'react';
import { set } from 'zod';
export default async function Notification() {
    const [notificationCount, setNotificationCount] = useState(0);
    const { userData } = useUser();

    useEffect(() => {
        setNotificationCount(0);
        const fetchNotificationCount = async () => {
        if(userData) {
            
                const response = await getNotificationCount(userData.uid);
                setNotificationCount(response);
            };
        }
        fetchNotificationCount();
    }, [userData, notificationCount, setNotificationCount]);
    return (
        <div className="relative flex ml-4 items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
            <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-900" />
            <span className="absolute top-0 right-0 h-5 w-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                {notificationCount}
            </span>
        </div>
    );
}