import admin from 'firebase-admin';

const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 as string,
    'base64'
  ).toString('utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://hamburgueria-12525.appspot.com',
});

export const bucket = admin.storage().bucket();
