import { Card } from "./Card"
import {CardGridProps} from "@/app/ui/friends/definitions";

export default async function CardGrid({ friends }: CardGridProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 px-3">
                
            {friends?.map((friend) => (
                <Card key={friend.id} friend={friend} />
             ))}
                
        </div>
    )
}