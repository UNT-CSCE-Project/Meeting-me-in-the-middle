"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  deleteFriend,
  sendFriendRequest,
  addFriend,
} from "@/app/lib/friends/actions";
import { connectedFriendItem, friendInfo } from "@/app/lib/friends/definitions";
import { useState } from "react";
import { useUser } from "@/app/UserContext";
import { pendingFriendItem } from "@/app/lib/friends/definitions";
import { invitationApproval } from "@/app/lib/locationApproval/actions";
import { any, set } from "zod";
import  {placeInfo}  from "@/app/lib/locationApproval/definitions";

export function SendRequest({
  request,
  onSendRequest,
}: {
  request: any;
  onSendRequest: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData } = useUser();

  const formData = new FormData();
  console.log(request);

  formData.append("sender_id", userData?.uid);
  formData.append(
    "sender_name",
    userData?.firstName + " " + userData?.lastName
  );
  formData.append("recipient_id", request.uid);
  formData.append("recipient_name", request?.name);
  formData.append("status", "pending");

  const connectRequest = async () => {
    setLoading(true);
    try {
      const response = await sendFriendRequest(formData);

      if (response.status === 200) {
        onSendRequest();
        setError(null);
      } else {
        setError(
          response.message ||
            "An error occurred while sending the friend request."
        );
      }
    } catch (error: any) {
      setError(
        error.message || "An error occurred while sending the friend request."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={connectRequest}>
      <button
        type="button"
        onClick={connectRequest}
        // Disable button while loading
        className={`flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
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
        {error && <span className="text-red-500">{error}</span>}{" "}
        {/* Display error message */}
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

export function DeleteFriend({
  request_id,
  onDelete,
}: {
  request_id: string;
  onDelete: () => void;
}) {
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
    } catch (error: any) {
      setError(error.message || "An error occurred while deleting the friend.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={deleteFriendWithId}>
      <button
        type="submit"
        className="flex h-10 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
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
  request: pendingFriendItem;
  onConnect: Function;
  isLoading: boolean;
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
  request: pendingFriendItem;
  onCancel: Function;
  isLoading: boolean;
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
  request: connectedFriendItem;
  onRemoveFriend: Function;
  isLoading: boolean;
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
  request: pendingFriendItem | connectedFriendItem;
  onClick: Function;
  isLoading: boolean;
  label: string;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
      }}
      disabled={isLoading}
      className={`w-20 mr-2 rounded-lg ${className} text-white py-2 hover:${className.replace(
        "600",
        "500"
      )} 
      ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {label}
    </button>
  );
}

export function InviteFriend({
  inviter,
  invitee,
  place,
  meetingTime
}: {
  inviter: friendInfo;
  invitee: friendInfo;
  place:  google.maps.places.PlaceResult;
  meetingTime: string | number | readonly string[] | undefined
}) {
  const [invitationSent, setInvitationSent] = useState(false);
  const [isPending, setIsPending] = useState(false);

  console.log("place", place);
  const handleInvite = async () => {
    setIsPending(true);
    try {
      const response = await invitationApproval(inviter, invitee, {
        name: place.name || "",
        place_id: place.place_id || "",
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
        rating: place.rating || 0,
        place_type: place.types || [],
      } as placeInfo,
      meetingTime) as any;
      console.log(response);
      if (response.status === 200) {
        setInvitationSent(true);
      } else {
        console.error("Error sending invitation:", response.message);
      }

    } catch (error) {
      console.error("Error inviting friend:", error);
    } finally {
      setIsPending(false);
    }
  }
  return (
    <button
      onClick={handleInvite}
      className={`ml-auto bg-indigo-500 text-white py-1 px-3 rounded hover:bg-indigo-600 focus:outline-none ${
        invitationSent ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isPending}
    >
      {invitationSent ? `Invitation Sent to ${invitee.name}` :   `Invite ${invitee.name}`}

    </button>
  );
}
