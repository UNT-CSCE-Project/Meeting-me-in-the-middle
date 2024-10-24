'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {  db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';  // Make sure to configure Firebase
import { stat } from 'fs';
import * as admin  from "firebase-admin";
import { addNotification } from '../notifications/actions';
import { Timestamp } from 'firebase/firestore';
import { friendRequest } from './definitions';
import { NotificationType } from '../notifications/definitions';
// Update the schema to include sender, recipient, status, and request_send_time
const FriendSchema = z.object({
  id: z.string().optional(),
  sender_id: z.string({
    invalid_type_error: 'Please provide a sender_id.',
  }).nonempty('Sender cannot be empty.'),
  sender_name: z.string({
    invalid_type_error: 'Please provide a sender_name.',
  }).nonempty('Sender cannot be empty.'),
  recipient_id: z.string({
    invalid_type_error: 'Please provide a recipient_id.',
  }).nonempty('Recipient cannot be empty.'),
  recipient_name: z.string({
    invalid_type_error: 'Please provide a recipient_name.',
  }).nonempty('Sender cannot be empty.'),
  status: z.enum(['pending', 'connected', 'not connected'], {
    invalid_type_error: 'Please provide a valid friend request status.',
  }),
  // request_send_time: z.string({
  //   invalid_type_error: 'Please provide a valid request send time.',
  // }).nonempty('Request send time cannot be empty.'),
  is_deleted: z.boolean().default(false),
});

const CreateFriend = FriendSchema.omit({ id: true });

export type State = {
  errors?: {
    sender_id?: string[];
    sender_name?: string[];
    recipient_id?: string[];
    recipent_name?: string[];
    status?: string[];
    request_send_time?: string[];
  };
  message?: string | null;
};

// Create a friend request in Firestore
export async function addFriend(id: string) {
  // Insert data into Firestore
  try {
    await firebaseFirestore.collection('friends').doc(id)
    .update({
      status: 'connected',
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      is_deleted: false,
    });

    // add notification
    const request = await firebaseFirestore.collection('friends').doc(id).get().then((doc) => doc.data() as friendRequest);

    const notificationResponse = await addNotification({
      sender_uid: request.recipient_id,
      recipient_uid: request.sender_id,
      sender_name: request.recipient_name,
      recipient_name: request.sender_name,
      message: `${request.recipient_name} accepted your friend request!`,
      type: NotificationType.FRIEND_REQUEST,
      isRead: false
    } as any)    


    if(notificationResponse.status === 500) {
      
      return {
        status: 500,
        message: 'Failed to send notification.',
      }
    }
    return {
      status: 200,
      message: 'Friend Request Created Successfully',
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Firestore Error: Failed to Create Friend Request.',
    };
  }

  // // Revalidate the cache and redirect
   revalidatePath('/dashboard/friends');
   
}

// Use Zod to update the expected types for updating a friend request
const sendRequest = FriendSchema.omit({ id: true });

export async function sendFriendRequest(formData: FormData) {
  const { sender_id, sender_name, recipient_id, recipient_name, status } = sendRequest.parse(Object.fromEntries(formData));

  // create friend request in Firestore
  try {
    const docRef = firebaseFirestore.collection('friends').doc();
    await docRef.set({
      sender_id,
      sender_name,
      recipient_id,
      recipient_name,
      status,
      request_send_time:  admin.firestore.FieldValue.serverTimestamp(),
      is_deleted: false,
    });

    // add notification

    docRef.get().then(async (doc) => {

      const notificationResponse = await addNotification({
        sender_uid: sender_id,
        recipient_uid: recipient_id,
        sender_name: sender_name,
        recipient_name: recipient_name,
        message: `${sender_name} sent you a friend request!`,
        type: NotificationType.FRIEND_REQUEST,
        isRead: false
      } as any)    
      if(notificationResponse.status === 500) {
        
        return {
          status: 500,
          message: 'Firestore Error: Failed to send notification'
        }
      } 
    })
    return { status: 200, message: 'Friend Request Sent.' };
  } catch (error) {
    // console.log(error);
    return { message: 'Firestore Error: Failed to send Friend Request.' };
  }
  revalidatePath('/dashboard/friends');

  return { message: 'Friend Request Sent.' };
}

// Delete a friend request from Firestore
export async function deleteFriend(id: string) {
  try {
    await firebaseFirestore.collection('friends').doc(id).update({ is_deleted: true });
    return { status: 200, message: 'Friend Request Cancelled.' };
  } catch (error) {
    return {
      status: 500,
      message: 'Firestore Error: Failed to Delete Friend Request.',
    };
  }

  revalidatePath('/dashboard/friends');
}

export async function fetchFriendRequest(id: string) {
  try {
    const friendSnapshot = await firebaseFirestore.collection('friends').doc(id).get();
    return friendSnapshot.data();
  } catch (error) {
    return null;
  }
}

