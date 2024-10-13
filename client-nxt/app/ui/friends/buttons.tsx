"use client";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { friend } from "./definitions";
import { deleteFriend,  sendFriendRequest } from '@/app/lib/friends/actions';
import {addNotification} from '@/app/lib/notifications/actions';
import { useState } from 'react';
export function SendRequest({ request }: { request: friend }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Sending friend request to ${request.name}: ${request.name}`);
      const formData = new FormData();
      formData.append('sender_id', "1");
      formData.append('sender_name', "Avijeet Shil");
      formData.append('recipient', request.id);
      formData.append('recipient_name', request.name);
      formData.append('status', 'pending');
      formData.append('request_send_time', new Date().toISOString());
      
      console.log(`formData: ${formData}`);
      let response = await sendFriendRequest( formData);
      if (response?.message) {
        setError(response?.message);
      } 
      /* TODO: Add notification */
      /* Start
      const notificationData = new FormData();
      notificationData.append('type', 'friend_request');
      notificationData.append('sender_id', "1");
      notificationData.append('sender_name', "Avijeet Shil");
      notificationData.append('message', `Friend request sent to ${request.name}`);
      try {
        await addNotification(notificationData);
      } catch (error) {
        setError('Failed to send notification.');
      }
      End */
      // Optionally, handle success (e.g., show a success message)
    } catch (err) {
      setError('Failed to send friend request.'); // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading} // Disable button while loading
      className={`flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <span className="hidden md:block">Connect</span>
          <PlusIcon className="h-5 md:ml-4" />
        </>
      )}
      {error && <span className="text-red-500">{error}</span>} {/* Display error message */}
    </button>
  );
}

export function UpdateFriend({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/friends/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteFriend({ id }: { id: string }) {
  const deleteFriendWithId = deleteFriend.bind(null, id);
 
  return (
    <form action={deleteFriendWithId}>
      <button type="submit"
      
      className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
>
        <span>Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}