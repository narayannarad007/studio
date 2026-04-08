import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

let serverApp: FirebaseApp;
let serverDb: Firestore;
let serverAuth: Auth;

export function initializeServerFirebase() {
  if (!getApps().length) {
    // Attempt automatic init (App Hosting)
    try {
      serverApp = initializeApp();
    } catch (e) {
      serverApp = initializeApp(firebaseConfig);
    }
  } else {
    serverApp = getApp();
  }

  serverDb = getFirestore(serverApp);
  serverAuth = getAuth(serverApp);

  return { serverApp, serverDb, serverAuth };
}
