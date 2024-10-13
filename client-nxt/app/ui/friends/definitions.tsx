export type friend = {
    id: string; 
    sender_id: string;
    sender_name: string; 
    recipient_id: string;
    recipient_name: string; 
    status: string; 
    request_send_time: string;
    is_deleted: boolean;
  };

export type CardGridProps = {
  friends: friend[];
}