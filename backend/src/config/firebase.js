// import admin from 'firebase-admin';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const serviceAccountPath = path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);

// try {
//     const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));

//     if (!admin.apps.length) {
//         admin.initializeApp({
//             credential: admin.credential.cert(serviceAccount),
//             storageBucket: process.env.FIREBASE_STORAGE_BUCKET
//         });
//         console.log('Firebase Admin initialized successfully');
//         console.log('Using storage bucket:', process.env.FIREBASE_STORAGE_BUCKET);
//     }
// } catch (error) {
//     console.error('Firebase admin initialization error:', error);
//     process.exit(1);
// }

// const db = admin.firestore();
// const auth = admin.auth();
// const bucket = admin.storage().bucket();

// export { db, auth, bucket };


export { }