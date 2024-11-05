"use server";
import { db } from "../firebaseAdmin";
import { fetchLocationApprovalByStatus } from "../locationApproval/data";
import { getAddress } from "@/app/utils/utils";
export async function fetchTravelHistoryByUserId(userId: string) {
    try {
        const travelHistorySnapshot = await db.collection('travel_history')
        .where('user_id', '==', userId).get();
        return travelHistorySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error('Error fetching travel history:', error);
        return [];
    }
}

export async function fetchTravelHistoryById(id: string) {
    try {
        const travelHistorySnapshot = await db.collection('travel_history').doc(id).get();
        return travelHistorySnapshot.data();
    } catch (error) {
        console.error('Error fetching travel history:', error);
        return null;
    }
}

export async function fetchTravelHistoryByLocationId(locationId: string) {
    try {
        const travelHistorySnapshot = await db.collection('travel_history').where('location_id', '==', locationId).get();
        return travelHistorySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error('Error fetching travel history:', error);
        return [];
    }
}

export default async function fetchTravelHistoryByUserIdAndIsTraveled(uid: string, isTraveled: boolean) {

  try {
    if (!uid) {
        console.log("Invalid UID: ", uid);
        return [];
    }
    if(uid == undefined || uid == null) {
      console.log("uid ", uid);
      return []
    }

    // Create two queries to fetch documents where either invitee or inviter UID matches the given UID
    const inviteeSnapshot = await db.collection('travel_history')
        .where('invitee.uid', '==', uid)
        .where('is_traveled', '==', isTraveled)
        .where('is_deleted', '==', false)
        .get();
    const inviterSnapshot = await db.collection('travel_history')
        .where('inviter.uid', '==', uid)  
        .where('is_traveled', '==', isTraveled)
        .where('is_deleted', '==', false)
        .get();


    // Merge results from both snapshots
    const mergedResults = [
        ...inviteeSnapshot.docs,
        ...inviterSnapshot.docs,
    ];

    // Map the documents to desired data format
    return mergedResults.map((doc) => ({
        id: doc.id,
        invitee: doc.data().invitee,
        inviter: doc.data().inviter,
        place: doc.data().place,
        address: getAddress(doc.data().place.lat, doc.data().place.lng),
        status: doc.data().status,
        meetingTime: doc.data().meetingTime,
        is_deleted: doc.data().is_deleted,
        updated_at: doc.data().updated_at.toDate().toISOString(),
    }));
} catch (error) {
    console.error('Error fetching location approval:', error);
    return [];
}
}