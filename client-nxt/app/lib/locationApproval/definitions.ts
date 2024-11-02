import { friendInfo } from "../friends/definitions";
import * as admin  from "firebase-admin";
export interface placeInfo {
    name: string;
    lat: string | number;
    lng: string | number;
    place_id: string;
    place_type: string[];
    rating: number;
}

export type approvalInfo = {
    id : string,
    invitee : friendInfo,
    inviter : friendInfo,
    place : google.maps.places.PlaceResult,
    address : string | null,
    status : string,
    request_send_time : Date | admin.firestore.FieldValue,
    is_deleted : boolean
    updated_at : Date | admin.firestore.FieldValue,
}