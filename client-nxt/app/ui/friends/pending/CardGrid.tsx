import { Card } from "./Card";
import { pendingFriendItem } from "@/app/lib/friends/definitions";export function CardGrid({
  requests,
  onAcceptRequest,
  onCancelRequest,
  isLoading
}: {
  requests: pendingFriendItem[],
  onAcceptRequest: Function,
  onCancelRequest: Function,
  isLoading: boolean
}) {
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 px-3">
      {requests?.map((request: pendingFriendItem) => (
        <Card
          key={request.id}
          request={request}
          onAcceptRequest={onAcceptRequest}
          onCancelRequest={onCancelRequest}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}