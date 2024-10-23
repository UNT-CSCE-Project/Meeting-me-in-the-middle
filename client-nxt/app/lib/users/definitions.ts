export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    phoneNumber: string;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    uid : string;
};


export type UserInfoWithStatus = {
    uid: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    requestId: string | null;
  };