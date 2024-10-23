import { connectedFriendItem } from "@/app/lib/friends/definitions";
import { Card } from "./Card";
export default async function CardGrid({ friends, 
    onRemoveFriend,
    isRemoving
} :{friends: connectedFriendItem[],
    onRemoveFriend: Function,
    isRemoving: boolean
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 px-3">
                
            {
                friends.map((friend: connectedFriendItem) => (
                    <Card 
                    key={friend.id} 
                    friend={friend} 
                    onRemoveFriend={onRemoveFriend}
                    isRemoving={isRemoving} />
                ))
            }
                
        </div>
    )
}