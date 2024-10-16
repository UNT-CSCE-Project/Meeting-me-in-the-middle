export type friendRequest = {
    id: string;
    sender_id: string;
    sender_name: string;
    recipient_id: string;
    recipent_name: string;
    status: 'pending' | 'connected' | 'not connected';
    request_send_time: string;
};
