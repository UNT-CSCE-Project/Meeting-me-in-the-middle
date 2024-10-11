export type friend = {
    id: string; 
    sender: string; 
    recipient: string; 
    status: string; 
    request_send_time: string;
    is_deleted: boolean;
  };

export type CardGridProps = {
  friends: friend[];
}