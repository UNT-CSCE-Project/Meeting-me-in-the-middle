export type friendRequest = {
    id: string;
    sender_id: string;
    sender_name: string;
    sender_firstName: string;
    sender_lastName: string;
    recipient_id: string;
    recipient_name: string;
    status: 'pending' | 'connected' | 'not connected';
    request_send_time: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    friend_uid: string;
    friend_name: string;
    is_deleted: boolean;
  }

export type friend = {
    id: string;
    friend_uid: string;
    friend_name: string;
    status:  'connected';
    request_send_time: string;
    is_deleted: boolean;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
}

export type friendItem = {
    id: string;
    friend_uid: string;
    friend_name: string;
    status: 'pending' | 'connected' | 'not connected';
    request_send_time: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    is_deleted: boolean;
  }

  export type pendingFriendItem = friendItem & {
    sender_id: string;
    sender_name: string;
    recipient_id: string;
    recipient_name: string;
  }

  export type connectedFriendItem = friendItem & {
    friend_uid: string;
    friend_name: string;
  }