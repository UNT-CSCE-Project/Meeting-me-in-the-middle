import { UserAvatar } from "../../userAvatar";
import { Connect } from "../buttons";
import { pendingFriendItem } from "@/app/lib/friends/definitions";
import { Cancel } from "../buttons";
export function Card({
  request,
  onAcceptRequest,
  onCancelRequest,
  isLoading,
}: {
  request: pendingFriendItem,
  onAcceptRequest: Function,
  onCancelRequest: Function,
  isLoading: boolean
}) {
  // console.log(JSON.stringify(request) + " ada ")
  return (
    <div className="rounded-xl bg-blue-50 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-start">
        {/* Avatar Section */}
        <UserAvatar firstName={request.sender_name.split(" ")[0]} lastName={request.sender_name.split(" ")[1]} />

        {/* Name, Title and Address Section */}
        <div className="ml-4">
          <h3 className="text-sm font-medium">{request.sender_name}</h3>
          <p className="text-xs text-gray-500">{request.streetAddress+", "+request.city+", "+request.state+", "+request.zipCode }</p>
        </div>
      </div>

      {/* Connect and Cancel Buttons */}
      <div className="mt-4 flex justify-end">
        <Connect request={request}
          onConnect={() => onAcceptRequest(request)}
          isLoading={isLoading}
        />
        <Cancel request={request}
          onCancel={() => onCancelRequest(request)
          }
          isLoading = {isLoading}
        />
      </div>
    </div>
  );
}