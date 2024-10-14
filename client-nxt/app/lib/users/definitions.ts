export type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    userName: string;
    password: string;
    phoneNumber: string;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null; 
    created_at: string | null; 
    updated_at: string | null;
    deleted_at: string | null;
};


export type UserInfoWithStatus = {
    id: string;
    name: string;
    email: string;
    status: string;
    requestId: string | null;
  };