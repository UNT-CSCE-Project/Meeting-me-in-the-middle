export type friendRequest = {
    id: string;
    sender: string;
    recipient: string;
    status: 'pending' | 'connected' | 'not connected';
    request_send_time: string;
};
