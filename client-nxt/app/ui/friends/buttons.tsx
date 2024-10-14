"use client";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { friend } from "./definitions";
import { deleteFriend,  sendFriendRequest } from '@/app/lib/friends/actions';
import {addNotification} from '@/app/lib/notifications/actions';
import { act, useState } from 'react';

import { on } from 'events';
import { connect } from 'http2';
export function SendRequest({ request }: { request: friend }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const formData = new FormData();

  formData.append('sender_id', "xo1sAzsKwYHfUoTaq2jN");
  formData.append('sender_name', "Avijeet Shil");
  formData.append('recipient_id', request.id);
  formData.append('recipient_name', request.name);
  formData.append('status', 'pending');
  formData.append('request_send_time', new Date().toISOString());
  const connectRequest = sendFriendRequest.bind(null, formData);
  return (

    <form action={connectRequest}>
        <button
      type='submit'
      
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

export function DeleteFriend({ request_id }: { request_id: string }) {
  const deleteFriendWithId = deleteFriend.bind(null, request_id);
 
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