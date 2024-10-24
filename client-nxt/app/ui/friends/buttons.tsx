"use client";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteFriend,  sendFriendRequest, addFriend } from '@/app/lib/friends/actions';
import { connectedFriendItem } from '@/app/lib/friends/definitions';
import {  useState } from 'react';
import { useUser } from '@/app/UserContext';
import { pendingFriendItem } from '@/app/lib/friends/definitions';
import { addNotification } from '@/app/lib/notifications/actions';
import { NotificationType } from '@/app/lib/notifications/definitions';
import { Timestamp } from 'firebase/firestore';
export function SendRequest({ request, onSendRequest  }: { request: any, onSendRequest: () => void }) {  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useUser();

  const formData = new FormData();
  console.log(request)

  formData.append('sender_id', userData?.uid);
  formData.append('sender_name', userData?.firstName+" "+userData?.lastName);
  formData.append('recipient_id', request.uid);
  formData.append('recipient_name', request?.name);
  formData.append('status', 'pending');
  const requestSendTime = new Date().toISOString();
  const timestamp = Timestamp.fromDate(new Date(requestSendTime));
  formData.append('request_send_time', timestamp.toString());
  const connectRequest = async () => {
    setLoading(true);
    try {
      const response = await sendFriendRequest(formData);
     
      if (response.status === 200) {
        onSendRequest();
        setError(null);
      } else {
        setError(response.message || 'An error occurred while sending the friend request.');  
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




export function Connect({
  request,
  onConnect,
  isLoading,
}: {
  request: pendingFriendItem,
  onConnect: Function,
  isLoading: boolean,
}) {
  return (
    <ActionButton
      request={request}
      onClick={onConnect}
      isLoading={isLoading}
      label="Connect"
      className="bg-blue-600"
    />
  );
}

export function Cancel({
  request,
  onCancel,
  isLoading,
}: {
  request: pendingFriendItem,
  onCancel: Function,
  isLoading: boolean,
}) {
  return (
    <ActionButton
      request={request}
      onClick={onCancel}
      isLoading={isLoading}
      label="Cancel"
      className="bg-red-600"
    />
  );
}


export function Remove({
  request,
  onRemoveFriend,
  isLoading,
}: {
  request: connectedFriendItem,
  onRemoveFriend: Function,
  isLoading: boolean,
}) {
  
  return (
    <ActionButton
      request={request}
      onClick={onRemoveFriend}
      isLoading={isLoading}
      label="Remove"
      className="bg-red-600"
    />
  );
}


export function ActionButton({
  request,
  onClick,
  isLoading,
  label,
  className,
}: {
  request: pendingFriendItem | connectedFriendItem,
  onClick: Function,
  isLoading: boolean,
  label: string,
  className: string,
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
      }}
      disabled={isLoading}
      className={`w-20 mr-2 rounded-lg ${className} text-white py-2 hover:${className.replace('600', '500')} 
      ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {label}
    </button>
  );
}


