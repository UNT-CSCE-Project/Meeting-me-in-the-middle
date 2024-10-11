import * as admin from 'firebase-admin';
import serviceAccountKey from '../lib/serviceAccountKey.json'; // Adjust the path based on your directory structure


if (!serviceAccountKey) {
    throw new Error('Firebase service account key not found!');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}
const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };