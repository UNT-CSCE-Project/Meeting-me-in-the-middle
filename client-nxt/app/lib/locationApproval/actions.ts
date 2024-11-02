'use server'
import {  db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';
import { friendInfo } from '../friends/definitions';
import { addNotification } from '../notifications/actions';
import { NotificationType } from '../notifications/definitions';
import * as admin  from "firebase-admin";
import { placeInfo } from '@/app/lib/locationApproval/definitions'
export async function invitationApproval( inviter: friendInfo, invitee: friendInfo, place: placeInfo) {
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
        });

        // add notification

        docRef.get().then(async (doc) => {
        const notificationResponse = await addNotification({
            sender_uid: inviter.uid,
            recipient_uid: invitee.uid,
            sender_name: inviter.name,
            recipient_name: invitee.name,
            message: `${inviter.name} sent you an invitation to meet in ${place.name}!`,
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

        // add notification
        await docRef.get().then(async (doc) => {
            const notificationResponse = await addNotification({
                sender_uid: doc.data()?.inviter.uid,
                recipient_uid: doc.data()?.invitee.uid,
                sender_name: doc.data()?.inviter.name,
                recipient_name: doc.data()?.invitee.name,
                message: `Your invitation to meet in ${doc.data()?.place.name} has been ${status}.`,
                type: NotificationType.INVITATION_REQUEST,
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