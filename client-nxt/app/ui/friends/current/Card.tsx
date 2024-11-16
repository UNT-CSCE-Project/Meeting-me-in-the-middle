import { UserAvatar } from "../../userAvatar";
import { connectedFriendItem } from "@/app/lib/friends/definitions";
import { Remove } from "../buttons";
export async function Card({ friend,
  onRemoveFriend,
  isRemoving } : {
  friend: connectedFriendItem,
  onRemoveFriend: Function,
  isRemoving: boolean
}) {
    
    return (
      <>
        <div className="rounded-xl bg-blue-50 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start">
            {/* Avatar Section */}
            <UserAvatar firstName={friend.friend_name.split(" ")[0]} lastName={friend.friend_name.split(" ")[1]}/>
  
            {/* Name, Title and Address Section */}
            <div className="ml-4">
              <h3 className="text-sm font-medium">{friend.friend_name}</h3>
              <p className="text-xs text-gray-600">{friend.streetAddress+", "+friend.city+", "+friend.state+", "+friend.zipCode}</p>
            </div>
          </div>
  
          {/* Remove Button */}
          <div className="mt-4 flex justify-end">
            <Remove 
            request={friend} 
            onRemoveFriend={() => onRemoveFriend(friend)}
            isLoading={isRemoving}/>
          </div>
        </div>
      </>
    );
  }