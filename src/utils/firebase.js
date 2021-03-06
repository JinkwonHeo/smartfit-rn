import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeFirestore } from 'firebase/firestore';
import {
  FIREBASE_APIKEY,
  FIREBASE_AUTHDOMAIN,
  FIREBASE_PROJECTID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APPID,
} from '@env';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  authDomain: FIREBASE_AUTHDOMAIN,
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APPID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle(response) {
  if (response?.type === 'success') {
    const { id_token } = response.params;
    const loginResult = await signInWithCredential(
      auth,
      GoogleAuthProvider.credential(id_token)
    );
    const { displayName, uid, email, photoURL } = loginResult.user;

    const docRef = doc(db, 'users', loginResult.user.uid);
    const docSnap = await getDoc(docRef);

    if (loginResult && !docSnap.exists()) {
      setDoc(
        doc(db, 'users', loginResult.user.uid),
        {
          displayName,
          uid,
          email,
          photoURL,
          liked: 0,
          likeTrainers: [],
          videos: [],
        },
        { merge: true }
      );
    }
  }
}
