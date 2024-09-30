// config/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL, // Replace with your Firebase Realtime Database URL if you're using it
});

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { admin, firestore, auth };
