import {  db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';

export async function fetchLocationApproval(id: string) {
    try {
        const locationApprovalSnapshot = await firebaseFirestore.collection('location_approvals').doc(id).get();
        return locationApprovalSnapshot.data();
    } catch (error) {
        return null;
    }
}


