import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase project configuration for AssetDoctor
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC6X3yKH1LhQjRHE_JJaLCrv9ug9yrzPEs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "assetdoctor-5fd25.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "assetdoctor-5fd25",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "assetdoctor-5fd25.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "926559836985",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:926559836985:web:3c4a58b18615ad342b66e8"
};

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Recaptcha Helper for Mobile OTP Authentication
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved callback
    }
  });
};

export { signInWithPhoneNumber, type ConfirmationResult };
