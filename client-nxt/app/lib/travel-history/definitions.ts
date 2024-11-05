import { friendInfo } from "../friends/definitions";
export type TravelPlanInfo = {
  id : string,
  invitee : friendInfo,
  inviter : friendInfo,
  place : google.maps.places.PlaceResult,
  destination : string,
  address : string | null,
  status : string,
  is_deleted : boolean
  meetingTime : string
  is_traveled: boolean;
  updated_at: Date | null;
};
