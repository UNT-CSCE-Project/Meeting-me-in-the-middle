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
        .where('status', 'in', ['pending', 'accepted'])
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
            meetingTime: doc.data().meetingTime,
            is_deleted: doc.data().is_deleted,
            updated_at: doc.data().updated_at.toDate().toISOString(),
          }));
    } catch (error) {
        console.error('Error fetching location approval:', error);

        return [];
    }
}

import { getDocs, collection, query, where } from 'firebase/firestore';
export async function fetchLocationApprovalByStatus(uid: string, status: string) {
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
      const inviteeSnapshot = await firebaseFirestore.collection('location_approvals')
          .where('invitee.uid', '==', uid)
          .where('status', '==', status)
          .where('is_deleted', '==', false)
          .get();
      const inviterSnapshot = await firebaseFirestore.collection('location_approvals')
          .where('inviter.uid', '==', uid)  
          .where('status', '==', status)
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
          request_send_time: doc.data().request_send_time.toDate().toISOString(),
          meetingTime: doc.data().meetingTime,
          is_deleted: doc.data().is_deleted,
          updated_at: doc.data().updated_at.toDate().toISOString(),
      }));
  } catch (error) {
      console.error('Error fetching location approval:', error);
      return [];
  }
}