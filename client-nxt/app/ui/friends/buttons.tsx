"use client";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { friend } from "./definitions";
import { deleteFriend,  sendFriendRequest, addFriend } from '@/app/lib/friends/actions';

import {  useState } from 'react';
import { useUser } from '@/app/UserContext';
export function SendRequest({ request, onSendRequest  }: { request: friend, onSendRequest: () => void }) {  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useUser();

  const formData = new FormData();

  formData.append('sender_id', userData?.uid);
  formData.append('sender_name', userData?.firstName+" "+userData?.lastName);
  formData.append('recipient_id', request.recipient_id);
  formData.append('recipient_name', request?.recipient_name);
  formData.append('status', 'pending');
  formData.append('request_send_time', new Date().toISOString());
  const connectRequest = async () => {
    setLoading(true);
    try {
      const response = await sendFriendRequest(formData);
      if (response.status === 200) {
        onSendRequest(); // Call the callback function
      }
    } catch (error : any) {
      setError(error.message || 'An error occurred while sending the friend request.');
    } finally {
      setLoading(false);
    }
  };
  return (

    <form onSubmit={connectRequest}>
        <button
      type='button'
      onClick={connectRequest}
    // Disable button while loading
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
    </form>
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

export function DeleteFriend({ request_id, onDelete }: { request_id: string, onDelete: () => void }) {  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 const deleteFriendWithId = async () => {
    setLoading(true);
    try {
      const response = await deleteFriend(request_id);
      // console.log(response);
      if (response?.status === 200) {
        onDelete();
      }
    } catch (error : any) {
      setError(error.message || 'An error occurred while deleting the friend.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={deleteFriendWithId}>
      <button type="submit"
      
      className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
>{loading ? (
        <span>Loading...</span>
      ) : (<>
        <span>Delete</span>
        <TrashIcon className="w-4" />
      </>
      )}
      </button>
    </form>
  );
}



interface ConnectProps {
  request_id: string;
  onConnect: () => void;
}

export function Connect({ request_id, onConnect }: ConnectProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null); // Reset error before making a request
    try {
      const response = await addFriend(request_id);
      if (response?.status === 200) {
        // console.log('Friend request created successfully:', request_id);
        onConnect(); // Call onConnect after success
      } else {
        setError('Failed to create friend request');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while creating the friend request.');
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
    <button
      onClick={handleConnect} // Trigger the connection logic
      type="button"
      disabled={loading}
      className="w-20 mr-2 rounded-lg bg-green-500 text-white py-2 hover:bg-green-600"
    >
      {loading ? 'Connecting...' : 'Connect'}
    </button>
    {error && <span className="text-red-500">{error}</span>} {/* Display error if any */}
  </form>
  );
}