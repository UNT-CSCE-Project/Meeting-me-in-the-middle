'use server'
import {  db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';
import { friendInfo } from '../friends/definitions';
import { addNotification } from '../notifications/actions';
import { NotificationType } from '../notifications/definitions';
import * as admin  from "firebase-admin";
import { placeInfo } from '@/app/lib/locationApproval/definitions'
import { getAddress } from '@/app/utils/utils';
export async function invitationApproval( inviter: friendInfo, invitee: friendInfo, place: placeInfo, meetingTime: string | number | readonly string[] | undefined) {
    try {
        const docRef = firebaseFirestore.collection('location_approvals').doc();
        await docRef.set({
            inviter: inviter,
            invitee: invitee,
            place: place,
            status: 'pending',
            request_send_time: admin.firestore.FieldValue.serverTimestamp(),
            is_deleted: false,
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
            meetingTime: meetingTime !== undefined ? new Date(meetingTime instanceof Date ? meetingTime : meetingTime.toString()).toLocaleString("en-US", {
              timeZone: "America/Chicago", // UTC-6 (Central Time)
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            }) : new Date(Date.now()).toLocaleString("en-US", {
              timeZone: "America/Chicago", // UTC-6 (Central Time)
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })
            ,
        });

        // add notification

        docRef.get().then(async (doc) => {
        const notificationResponse = await addNotification({
            sender_uid: inviter.uid,
            recipient_uid: invitee.uid,
            sender_name: inviter.name,
            recipient_name: invitee.name,
            meetingTime: doc.data()?.meetingTime,
            message: `${inviter.name} sent you an invitation to meet in ${place.name} at ${doc.data()?.meetingTime}!`,
            type: NotificationType.INVITATION_REQUEST,
            isRead: false
        } as any)

        if (notificationResponse.status === 500) {
            return { status: 500, message: 'Failed to send notification.' }
        } else {
            return { status: 200, message: 'Invitation Sent.' }
        }
        })
        return { status: 200, message: 'Invitation Sent.' }
    } catch (error) {
        console.error("Error inviting friend:", error);
        return { status: 500, message: 'Firestore Error: Failed to invite friend.' };
        
    }
}


export async function updateStatus(id: string, status: string) {
    try {
        const docRef = firebaseFirestore.collection('location_approvals').doc(id);
        await docRef.update({
            status: status,
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });

        if (status === 'accepted') {
            /* add to travel history */
            await docRef.get().then(async (doc) => {
                const travelHistoryDocRef = firebaseFirestore.collection('travel_history').doc();
                await travelHistoryDocRef.set({
                    inviter: doc.data()?.inviter,
                    invitee: doc.data()?.invitee,
                    place: doc.data()?.place,
                    address: await getAddress(doc.data()?.place.lat, doc.data()?.place.lng),
                    is_traveled: false,
                    is_deleted: false,
                    updated_at: admin.firestore.FieldValue.serverTimestamp(),
                    meetingTime: doc.data()?.meetingTime
                });
            })
        }
        // add notification
        await docRef.get().then(async (doc) => {
            const notificationResponse = await addNotification({
                sender_uid: doc.data()?.invitee.uid,
                recipient_uid: doc.data()?.inviter.uid,
                sender_name: doc.data()?.invitee.name,
                recipient_name: doc.data()?.inviter.name,
                message: `Your invitation to meet in ${doc.data()?.place.name} at ${doc.data()?.meetingTime} has been ${status}.`,
                type: NotificationType.INVITATION_RESPONSE,
                isRead: false
            } as any) 

            if (notificationResponse.status === 500) {
                return { status: 500, message: 'Failed to send notification.' }
            } else {
                return { status: 200, message: 'Status updated successfully.' }
            }
        })
        return { status: 200, message: 'Status updated successfully.' };
    } catch (error) {
        console.error("Error updating status:", error);
        return { status: 500, message: 'Firestore Error: Failed to update status.' };
    }
}