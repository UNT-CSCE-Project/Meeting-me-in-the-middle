"use server";
import { db as firebaseFirestore } from "../firebaseAdmin";
import * as admin from "firebase-admin";
import { TravelPlanInfo } from "../travel-history/definitions";
export async function deleteTravelHistory(id: string) {
    try {
        await firebaseFirestore.collection('travel_history').doc(id)
        .update({ is_deleted: true })
        .then(() => console.log("Document successfully deleted!"));
        return { status: 200, message: 'Travel History Deleted.' };
    } catch (error) {
        return {
            status: 500,
            message: 'Firestore Error: Failed to Delete Travel History.',
        };
    }
}


export async function createTravelPlan(travelPlanInfo: TravelPlanInfo) {
    try {
        const docRef = firebaseFirestore.collection('travel_history').doc();
        await docRef.set(travelPlanInfo);
        return { status: 200, message: 'Travel History Created.' };
    } catch (error) {
        return {
            status: 500,
            message: 'Firestore Error: Failed to Create Travel History.',
        };
    }
}
export async function updateTravelHistory(id: string, status: string) {
    try {
        const docRef = firebaseFirestore.collection('travel_history').doc(id);
        await docRef.update({
            is_traveled: status === 'Traveled' ? true : false,
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { status: 200, message: 'Travel History Updated.' };
    } catch (error) {
        return {
            status: 500,
            message: 'Firestore Error: Failed to Update Travel History.',
        };
    }
}

