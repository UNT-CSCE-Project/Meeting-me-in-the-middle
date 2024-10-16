import * as admin from 'firebase-admin';
const serviceAccount = {
  "type": "service_account",
  "project_id": `${process.env.FIREBASE_PROJECT_ID}`, // process.env.FIREBASE_PROJECT_ID,
  "private_key_id": `${process.env.FIREBASE_PRIVATE_KEY_ID}`,
  "private_key": `-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`, // Replace escaped newlines
  "client_email": `${process.env.FIREBASE_CLIENT_EMAIL}`,
  "client_id": `${process.env.FIREBASE_CLIENT_ID}`,
  "auth_uri": `${process.env.FIREBASE_AUTH_URI}`,
  "token_uri": `${process.env.FIREBASE_TOKEN_URI}`,
  "auth_provider_x509_cert_url": `${process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL}`,
  "client_x509_cert_url": `${process.env.FIREBASE_CLIENT_X509_CERT_URL}`,
  "universe_domain": `${process.env.FIREBASE_UNIVERSE_DOMAIN}`,
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}



const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };