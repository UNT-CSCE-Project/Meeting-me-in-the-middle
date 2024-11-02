"use server";
import {  db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';
import { getAddress } from '@/app/utils/utils';

export async function fetchLocationApprovals(uid: string) {
    try {
       // console.log('id:', id);
       if(uid == undefined || uid == null) {
        console.log("uid ", uid);
        return []
      }
        const locationApprovalSnapshot = await firebaseFirestore.collection('location_approvals')

        .where('is_deleted', '==', false)
        .where('invitee.uid', '==', uid)
        .where('status', '==', 'pending' || 'accepted')
        .get();
        return locationApprovalSnapshot.docs
        .map((doc) => ({
            id: doc.id,
            invitee: doc.data().invitee,
            inviter: doc.data().inviter,
            place: doc.data().place,
            address: getAddress(doc.data().place.lat, doc.data().place.lng),
            status: doc.data().status,
            request_send_time: doc.data().request_send_time.toDate().toISOString(),
            is_deleted: doc.data().is_deleted,
            updated_at: doc.data().updated_at.toDate().toISOString(),
          }));
    } catch (error) {
        console.error('Error fetching location approval:', error);

        return [];
    }
}


