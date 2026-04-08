import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // In Firebase App Hosting, the environment is automatically configured.
      // If running locally, you may need a service account key or ADC.
    });
  } catch (error) {
    console.warn('Firebase Admin init error:', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
