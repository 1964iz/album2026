import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let firestoreInstance: Firestore | null = null;

export function getDb(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    if (firebaseConfig.firestoreDatabaseId) {
      firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    } else {
      firestoreInstance = getFirestore(app);
    }
    return firestoreInstance;
  } catch (error) {
    console.error('Erro ao inicializar o Firebase Firestore:', error);
    return null;
  }
}
