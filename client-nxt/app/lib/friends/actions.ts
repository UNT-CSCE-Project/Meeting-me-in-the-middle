'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db as firebaseFirestore  } from '@/app/lib/firebaseAdmin.js';  // Make sure to configure Firebase

// Update the schema to include sender, recipient, status, and request_send_time
const FriendSchema = z.object({
  id: z.string().optional(),
  sender: z.string({
    invalid_type_error: 'Please provide a sender.',
  }).nonempty('Sender cannot be empty.'),
  recipient: z.string({
    invalid_type_error: 'Please provide a recipient.',
  }).nonempty('Recipient cannot be empty.'),
  status: z.enum(['pending', 'connected', 'not connected'], {
    invalid_type_error: 'Please provide a valid friend request status.',
  }),
  request_send_time: z.string({
    invalid_type_error: 'Please provide a valid request send time.',
  }).nonempty('Request send time cannot be empty.'),
  is_deleted: z.boolean().default(false),
});

const CreateFriend = FriendSchema.omit({ id: true });

export type State = {
  errors?: {
    sender?: string[];
    recipient?: string[];
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
      request_send_time: new Date().toISOString(),
      is_deleted: false,
    });
  } catch (error) {
    return {
      message: 'Firestore Error: Failed to Create Friend Request.',
    };
  }

  // // Revalidate the cache and redirect
   revalidatePath('/dashboard/friends');
   
}

// Use Zod to update the expected types for updating a friend request
const sendRequest = FriendSchema.omit({ id: true });

export async function sendFriendRequest(formData: FormData) {
  const validatedFields = sendRequest.safeParse({
    sender: formData.get('sender'),
    recipient: formData.get('recipient'),
    status: formData.get('status'),
    request_send_time: formData.get('request_send_time'),
    is_deleted: false,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to send Friend Request.',
    };
  }

  const { sender, recipient, status, request_send_time } = validatedFields.data;

  // create friend request in Firestore
  try {
    const docRef = firebaseFirestore.collection('friends').doc();
    await docRef.set({
      sender,
      recipient,
      status,
      request_send_time,
      is_deleted: false,
    });
  } catch (error) {
    return { message: 'Firestore Error: Failed to send Friend Request.' };
  }

  //revalidatePath('/dashboard/friends');
  //redirect('/dashboard/friends');
}

// Delete a friend request from Firestore
export async function deleteFriend(id: string) {
  try {
    await firebaseFirestore.collection('friends').doc(id).update({ is_deleted: true });
  } catch (error) {
    return {
      message: 'Firestore Error: Failed to Delete Friend Request.',
    };
  }

  revalidatePath('/dashboard/Friends');
}
