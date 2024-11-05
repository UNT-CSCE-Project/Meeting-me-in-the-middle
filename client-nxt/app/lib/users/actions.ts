
"use server";
import { z } from 'zod';

import { db } from '@/app/lib/firebaseAdmin.js';  // Make sure to configure Firebase
;
const UserSchema = z.object({
  email: z.string({
    invalid_type_error: 'Please provide a valid email.',
  }).email('Invalid email address'),

  streetAddress: z.string({
    invalid_type_error: 'Please provide a valid street address.',
  }),
  city: z.string({
    invalid_type_error: 'Please provide a valid city.',
  }),
  state: z.string({
    invalid_type_error: 'Please provide a valid state.',
  }),
  zipCode: z.string({
    invalid_type_error: 'Please provide a valid zip code.',
  }).regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code'),

  firstName: z.string({
    invalid_type_error: 'Please provide a valid first name.',
  }),
  lastName: z.string({
    invalid_type_error: 'Please provide a valid last name.',
  }),
  phoneNumber: z.string({
    invalid_type_error: 'Please provide a valid phone number.',
  }).regex(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone number'),
});

export async function addUser(formData: FormData) {
  // Validate the form data
  const validatedFields = UserSchema.safeParse({
    email: formData.get('email'),
    streetAddress: formData.get('streetAddress'),
    city: formData.get('city'),
    state: formData.get('state'),
    zipCode: formData.get('zipCode'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phoneNumber: formData.get('phoneNumber'),
  });
  // console.log(validatedFields.data, ' ', validatedFields.error, ' ', formData);
  // If the form data is invalid, return an error
  if (!validatedFields.success) {
    const issues = validatedFields.error.issues;
    const errorMessage = issues.map((issue) => issue.message).join(', ');
    return {
      status: 200,
      message: errorMessage,
    };
  }
  try{
    // Get the validated form data
    const { email, streetAddress, city, state, zipCode, firstName, lastName, phoneNumber } = validatedFields.data;

    // Check if the user already exists
    const userQuerySnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();

    // If user already exists, handle accordingly
    if (!userQuerySnapshot.empty) {
      // console.log('User already exists');
      return { status: 200, message: 'User already exists.' }; // Optionally, return or throw an error
    }

    // If user does not exist, add them to the collection
    const userRef = db.collection('users').doc(); // Create a new document reference
    await userRef.set({
      uid: formData.get('uid'),
      email,
      streetAddress, city, state, zipCode,
      firstName,
      lastName,
      phoneNumber,
    }); // Set the user data

    return { status: 200, message: 'User added successfully.' };
    // console.log('User added successfully');
  } catch (error) {
    return { status: 500, message: 'Firestore Error: Failed to Add User.' };
  }
  

}